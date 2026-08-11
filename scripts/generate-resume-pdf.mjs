import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

const root = process.cwd();
const resume = JSON.parse(fs.readFileSync(path.join(root, "src/data/resume.json"), "utf8"));
const outputPath = path.join(root, "public/ar-razy-fathan-rabbani-cv.pdf");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const PAGE = { width: 595.28, height: 841.89 };
const margin = 52;
const bottom = PAGE.height - 52;
const contentWidth = PAGE.width - margin * 2;
const colors = { text: "#172033", muted: "#5f6775", rule: "#d9dee7", link: "#1f5a87" };

const doc = new PDFDocument({
  size: "A4",
  margins: { top: margin, bottom: margin, left: margin, right: margin },
  info: {
    Title: `${resume.name} - CV`,
    Author: resume.name,
    Subject: "Curriculum vitae",
    Keywords: "CV, resume, mobile engineer, Android engineer",
  },
});
doc.pipe(fs.createWriteStream(outputPath));

const setFont = (size, color = colors.text, bold = false) => {
  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor(color);
};
const addPage = () => {
  doc.addPage();
  doc.x = margin;
  doc.y = margin;
};
const ensureSpace = (height) => {
  if (doc.y + height > bottom) {
    addPage();
    return true;
  }
  return false;
};
const printableUrl = (url) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
const textHeight = (text, size, options = {}) => {
  setFont(size, options.color ?? colors.text, options.bold ?? false);
  return doc.heightOfString(text, { width: options.width ?? contentWidth, lineGap: options.lineGap ?? 2 });
};
const drawSectionHeading = (title) => {
  ensureSpace(36);
  setFont(12, colors.text, true);
  doc.text(title.toUpperCase(), { characterSpacing: 0.7 });
  const ruleY = doc.y + 5;
  doc.moveTo(margin, ruleY).lineTo(PAGE.width - margin, ruleY).strokeColor(colors.rule).lineWidth(0.7).stroke();
  doc.y = ruleY + 14;
};
const drawBody = (text, options = {}) => {
  const size = options.size ?? 9.7;
  const lineGap = options.lineGap ?? 2.5;
  const height = textHeight(text, size, { ...options, lineGap });
  ensureSpace(height + 2);
  setFont(size, options.color ?? colors.text, options.bold ?? false);
  doc.text(text, { width: options.width ?? contentWidth, lineGap });
};
const drawBullets = (items) => {
  for (const item of items) {
    const text = `- ${item}`;
    const height = textHeight(text, 9.2, { lineGap: 2 });
    ensureSpace(height + 3);
    setFont(9.2, colors.text);
    doc.text(text, { width: contentWidth - 8, indent: 8, lineGap: 2 });
    doc.y += 3;
  }
};
const drawWorkItem = (item) => {
  ensureSpace(54);
  const titleY = doc.y;
  setFont(10.8, colors.text, true);
  doc.text(item.company, margin, titleY, item.link ? { link: item.link, underline: true, continued: true } : { continued: true });
  setFont(9.2, colors.muted);
  doc.text(`  ${item.title}`, { continued: true });
  doc.text(`  ${item.start} - ${item.end ?? "Present"}`, { align: "right" });
  doc.y += 5;
  drawBody(item.description.paragraph, { size: 9.2, lineGap: 2 });
  doc.y += 5;
  drawBullets(item.description.bullets);
  doc.y += 11;
};
const drawProject = (project) => {
  const titleHeight = textHeight(project.title, 9.5, { bold: true, lineGap: 1.5 });
  const descriptionHeight = textHeight(project.description, 8.6, { lineGap: 1.6 });
  ensureSpace(titleHeight + descriptionHeight + 28);
  setFont(9.5, colors.text, true);
  if (project.link.href) {
    doc.text(project.title, { continued: true, link: project.link.href, underline: true });
    setFont(7.8, colors.link);
    doc.text(`  ${printableUrl(project.link.href)}`);
  } else {
    doc.text(project.title);
  }
  drawBody(project.description, { size: 8.6, lineGap: 1.6, color: colors.muted });
  setFont(7.8, colors.muted);
  doc.text(project.techStack.join("  /  "), { width: contentWidth, lineGap: 1.3 });
  doc.y += 9;
};

setFont(23, colors.text, true);
doc.text(resume.name);
doc.y += 3;
setFont(11, colors.muted);
doc.text(resume.about);
doc.y += 7;

const location = resume.location.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "").replace(/\s{2,}/g, " ").trim();
setFont(8.8, colors.muted);
const contacts = [location, resume.contact.email, ...resume.contact.social.map((social) => social.name)].filter(Boolean);
let contactX = margin;
const contactY = doc.y;
for (const [index, part] of contacts.entries()) {
  const social = resume.contact.social.find((item) => item.name === part);
  const href = part === resume.contact.email ? `mailto:${part}` : social?.url;
  const partWidth = doc.widthOfString(part);
  doc.text(part, contactX, contactY, { underline: Boolean(href) });
  if (href) doc.link(contactX, contactY, partWidth, 12, href);
  contactX += partWidth;
  if (index < contacts.length - 1) {
    const separator = "  /  ";
    doc.text(separator, contactX, contactY);
    contactX += doc.widthOfString(separator);
  }
}
doc.x = margin;
doc.y = contactY + 18;

drawSectionHeading("About");
drawBody(resume.summary, { size: 9.7, lineGap: 2.5 });
doc.y += 10;
drawSectionHeading("Work Experience");
for (const item of resume.work) drawWorkItem(item);
drawSectionHeading("Education");
for (const item of resume.education) {
  ensureSpace(34);
  setFont(9.5, colors.text, true);
  doc.text(item.school, { continued: true });
  setFont(8.5, colors.muted);
  doc.text(`  ${item.start} - ${item.end}`, { align: "right" });
  doc.y += 3;
  drawBody(item.degree, { size: 9.2, color: colors.muted });
  doc.y += 10;
}
drawSectionHeading("Skills");
for (const [label, values] of [
  ["Programming Languages", resume.skills.programmingLanguages],
  ["Mobile", resume.skills.mobile],
  ["Tools", resume.skills.toolbox],
]) {
  ensureSpace(25);
  setFont(8.5, colors.text, true);
  doc.text(`${label}: `, { continued: true });
  setFont(8.5, colors.muted);
  doc.text(values.join("  /  "));
  doc.y += 7;
}
addPage();
drawSectionHeading("Projects");
for (const project of resume.projects) drawProject(project);

doc.end();
console.log(`Generated ${path.relative(root, outputPath)}`);
