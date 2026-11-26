import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

const root = process.cwd();
const resume = JSON.parse(fs.readFileSync(path.join(root, "src/data/resume.json"), "utf8"));
const outputPath = path.join(root, "public/CV - Ar Razy Fathan Rabbani.pdf");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const PAGE = { width: 595.28, height: 841.89 };
const marginX = 48;
const marginTop = 44;
const marginBottom = 46;
const bottom = PAGE.height - marginBottom;
const contentWidth = PAGE.width - marginX * 2;

const colors = {
  ink: "#111827",
  body: "#1F2937",
  muted: "#4B5563",
  rule: "#D1D5DB",
  link: "#1D4ED8",
};

const sanitizeAscii = (value = "") =>
  value
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u00B7/g, "|")
    .replace(/\s{2,}/g, " ")
    .trim();

const cleanUrl = (rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete("pcampaignid");
    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

const printableUrl = (rawUrl) =>
  cleanUrl(rawUrl)
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: marginTop, bottom: marginBottom, left: marginX, right: marginX },
  bufferPages: true,
  info: {
    Title: `${resume.name} - CV`,
    Author: resume.name,
    Subject: "Curriculum Vitae",
    Keywords: [
      "CV",
      "Resume",
      "Mobile Engineer",
      "Android Engineer",
      "Kotlin",
      "Jetpack Compose",
      "Flutter",
      "Kotlin Multiplatform",
    ].join(", "),
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const setFont = (size, color = colors.body, bold = false) => {
  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor(color);
};

const addPage = () => {
  doc.addPage();
  doc.x = marginX;
  doc.y = marginTop;
};

const ensureSpace = (height) => {
  if (doc.y + height > bottom) {
    addPage();
    return true;
  }
  return false;
};

const measureHeight = (text, size, options = {}) => {
  setFont(size, options.color ?? colors.body, options.bold ?? false);
  return doc.heightOfString(text, {
    width: options.width ?? contentWidth,
    lineGap: options.lineGap ?? 2,
  });
};

const drawSectionHeading = (title, minContentHeight = 40) => {
  ensureSpace(26 + minContentHeight);
  setFont(10.5, colors.ink, true);
  doc.text(title.toUpperCase(), marginX, doc.y, {
    width: contentWidth,
    characterSpacing: 0.6,
  });
  const ruleY = doc.y + 3;
  doc
    .moveTo(marginX, ruleY)
    .lineTo(PAGE.width - marginX, ruleY)
    .strokeColor(colors.rule)
    .lineWidth(0.75)
    .stroke();
  doc.x = marginX;
  doc.y = ruleY + 9;
};

const drawBody = (text, options = {}) => {
  const size = options.size ?? 9.6;
  const lineGap = options.lineGap ?? 2.2;
  const width = options.width ?? contentWidth;
  const x = options.x ?? marginX;
  const clean = sanitizeAscii(text);
  const height = measureHeight(clean, size, { width, lineGap, bold: options.bold });
  ensureSpace(height + 2);
  setFont(size, options.color ?? colors.body, options.bold ?? false);
  doc.text(clean, x, doc.y, { width, lineGap });
  doc.x = marginX;
};

const drawLeftRightRow = ({
  leftText,
  rightText,
  leftSize = 10.2,
  rightSize = 9.2,
  leftBold = true,
  rightBold = false,
  leftColor = colors.ink,
  rightColor = colors.muted,
  leftLink = null,
}) => {
  const cleanLeft = sanitizeAscii(leftText);
  const cleanRight = sanitizeAscii(rightText);

  setFont(rightSize, rightColor, rightBold);
  const rightWidth = cleanRight ? doc.widthOfString(cleanRight) : 0;
  const leftWidth = cleanRight ? contentWidth - rightWidth - 12 : contentWidth;

  const leftHeight = measureHeight(cleanLeft, leftSize, { width: leftWidth, bold: leftBold, lineGap: 1.5 });
  const rightHeight = cleanRight ? measureHeight(cleanRight, rightSize, { width: rightWidth + 2, bold: rightBold }) : 0;
  const rowHeight = Math.max(leftHeight, rightHeight);

  ensureSpace(rowHeight + 2);
  const rowY = doc.y;

  setFont(leftSize, leftColor, leftBold);
  doc.text(cleanLeft, marginX, rowY, {
    width: leftWidth,
    lineGap: 1.5,
    ...(leftLink ? { link: leftLink, underline: false } : {}),
  });

  if (cleanRight) {
    setFont(rightSize, rightColor, rightBold);
    doc.text(cleanRight, marginX, rowY + (leftSize - rightSize) * 0.15, {
      width: contentWidth,
      align: "right",
    });
  }

  doc.x = marginX;
  doc.y = rowY + rowHeight;
};

const drawContactBlock = (items) => {
  const fontSize = 8.6;
  const separator = " | ";
  const lineHeight = 13;

  setFont(fontSize, colors.muted, false);
  const sepWidth = doc.widthOfString(separator);

  const lines = [];
  let currentLine = [];
  let currentWidth = 0;

  for (const item of items) {
    const label = sanitizeAscii(item.label);
    const labelWidth = doc.widthOfString(label);
    const extra = currentLine.length > 0 ? sepWidth + labelWidth : labelWidth;

    if (currentLine.length > 0 && currentWidth + extra > contentWidth) {
      lines.push(currentLine);
      currentLine = [{ ...item, label, width: labelWidth }];
      currentWidth = labelWidth;
    } else {
      currentLine.push({ ...item, label, width: labelWidth });
      currentWidth += extra;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  for (const line of lines) {
    let x = marginX;
    const y = doc.y;
    for (const [index, part] of line.entries()) {
      setFont(fontSize, part.href ? colors.link : colors.muted, false);
      doc.text(part.label, x, y, { lineBreak: false });
      if (part.href) {
        doc.link(x, y - 1, part.width, fontSize + 3, part.href);
      }
      x += part.width;

      if (index < line.length - 1) {
        setFont(fontSize, colors.muted, false);
        doc.text(separator, x, y, { lineBreak: false });
        x += sepWidth;
      }
    }
    doc.x = marginX;
    doc.y = y + lineHeight;
  }
};

const drawBullets = (items) => {
  const bulletIndent = 8;
  const textIndent = 18;
  const bulletWidth = contentWidth - textIndent;

  for (const rawItem of items) {
    const text = sanitizeAscii(rawItem);
    const height = measureHeight(text, 9.4, { width: bulletWidth, lineGap: 2 });
    ensureSpace(height + 3);
    const y = doc.y;

    setFont(9.4, colors.muted, true);
    doc.text("-", marginX + bulletIndent, y, { lineBreak: false });

    setFont(9.4, colors.body, false);
    doc.text(text, marginX + textIndent, y, { width: bulletWidth, lineGap: 2 });
    doc.x = marginX;
    doc.y = y + height + 2.5;
  }
};

const drawWorkItem = (item) => {
  const dateRange = `${item.start} - ${item.end ?? "Present"}`;
  const companyLine = [item.company, item.location].filter(Boolean).join(" | ");

  const headerEstimate = 34 + measureHeight(sanitizeAscii(item.description.paragraph), 9.4, { lineGap: 2 });
  ensureSpace(headerEstimate);

  drawLeftRightRow({
    leftText: item.title,
    rightText: dateRange,
    leftSize: 10.4,
    rightSize: 9.2,
    leftBold: true,
    leftColor: colors.ink,
    rightColor: colors.muted,
  });

  doc.y += 1.5;

  setFont(9.5, colors.muted, true);
  const companyY = doc.y;
  const cleanCompany = sanitizeAscii(item.company);
  if (item.link) {
    const companyWidth = doc.widthOfString(cleanCompany);
    doc.text(cleanCompany, marginX, companyY, { continued: Boolean(item.location) });
    doc.link(marginX, companyY - 1, companyWidth, 12, cleanUrl(item.link));
    if (item.location) {
      setFont(9.5, colors.muted, false);
      doc.text(` | ${sanitizeAscii(item.location)}`);
    }
  } else {
    doc.text(sanitizeAscii(companyLine), marginX, companyY, { width: contentWidth });
  }
  doc.x = marginX;
  doc.y += 4.5;

  drawBody(item.description.paragraph, { size: 9.4, lineGap: 2 });
  doc.y += 4;

  drawBullets(item.description.bullets);

  if (Array.isArray(item.badges) && item.badges.length > 0) {
    doc.y += 1.5;
    const techLabel = "Key Technologies: ";
    const techList = item.badges.map(sanitizeAscii).join(", ");
    const techHeight = measureHeight(`${techLabel}${techList}`, 9, { lineGap: 1.5 });
    ensureSpace(techHeight + 2);
    setFont(9, colors.muted, true);
    doc.text(techLabel, marginX, doc.y, { width: contentWidth, continued: true, lineGap: 1.5 });
    setFont(9, colors.muted, false);
    doc.text(techList, { width: contentWidth, lineGap: 1.5 });
    doc.x = marginX;
  }

  doc.y += 10;
};

const drawSkillRow = (label, values) => {
  const cleanValues = values.map(sanitizeAscii).join(", ");
  const fullHeight = measureHeight(`${label}: ${cleanValues}`, 9.3, { lineGap: 2 });
  ensureSpace(fullHeight + 4);
  setFont(9.3, colors.ink, true);
  doc.text(`${label}: `, marginX, doc.y, { width: contentWidth, continued: true, lineGap: 2 });
  setFont(9.3, colors.body, false);
  doc.text(cleanValues, { width: contentWidth, lineGap: 2 });
  doc.x = marginX;
  doc.y += 4;
};

const drawProject = (project) => {
  const href = project.link?.href ? cleanUrl(project.link.href) : "";
  const urlText = href ? printableUrl(href) : "";
  const techText = Array.isArray(project.techStack)
    ? `Tech Stack: ${project.techStack.map(sanitizeAscii).join(", ")}`
    : "";

  const titleLineHeight = measureHeight(
    urlText ? `${sanitizeAscii(project.title)} | ${urlText}` : sanitizeAscii(project.title),
    9.6,
    { bold: true, lineGap: 1.5 }
  );
  const descHeight = measureHeight(sanitizeAscii(project.description), 9.2, { lineGap: 1.8 });
  const techHeight = techText ? measureHeight(techText, 8.8, { lineGap: 1.5 }) : 0;

  ensureSpace(titleLineHeight + descHeight + techHeight + 14);

  const titleY = doc.y;
  setFont(9.8, colors.ink, true);
  const cleanTitle = sanitizeAscii(project.title);
  if (href) {
    const titleWidth = doc.widthOfString(cleanTitle);
    const sep = " | ";
    setFont(8.8, colors.muted, false);
    const sepWidth = doc.widthOfString(sep);
    const urlWidth = doc.widthOfString(urlText);
    const fitsSameLine = titleWidth + sepWidth + urlWidth <= contentWidth;

    if (fitsSameLine) {
      setFont(9.8, colors.ink, true);
      doc.text(cleanTitle, marginX, titleY, { lineBreak: false });
      setFont(8.8, colors.muted, false);
      doc.text(sep, marginX + titleWidth, titleY + 0.8, { lineBreak: false });
      setFont(8.8, colors.link, false);
      doc.text(urlText, marginX + titleWidth + sepWidth, titleY + 0.8, { lineBreak: false });
      doc.link(marginX + titleWidth + sepWidth, titleY, urlWidth, 12, href);
      doc.x = marginX;
      doc.y = titleY + 13;
    } else {
      setFont(9.8, colors.ink, true);
      doc.text(cleanTitle, marginX, titleY, { width: contentWidth });
      const urlY = doc.y + 1;
      setFont(8.6, colors.link, false);
      doc.text(urlText, marginX, urlY, { width: contentWidth });
      doc.link(marginX, urlY - 1, Math.min(urlWidth, contentWidth), 12, href);
      doc.x = marginX;
      doc.y = doc.y + 1.5;
    }
  } else {
    doc.text(cleanTitle, marginX, titleY, { width: contentWidth });
    doc.x = marginX;
    doc.y += 1.5;
  }

  drawBody(project.description, { size: 9.2, lineGap: 1.8, color: colors.body });

  if (techText) {
    doc.y += 1.5;
    setFont(8.8, colors.muted, true);
    doc.text("Tech Stack: ", marginX, doc.y, { width: contentWidth, continued: true, lineGap: 1.5 });
    setFont(8.8, colors.muted, false);
    doc.text(project.techStack.map(sanitizeAscii).join(", "), { width: contentWidth, lineGap: 1.5 });
    doc.x = marginX;
  }

  doc.y += 8;
};

// Header
setFont(20, colors.ink, true);
doc.text(sanitizeAscii(resume.name), marginX, marginTop, { width: contentWidth });
doc.y += 2;

setFont(10.5, colors.muted, false);
doc.text(sanitizeAscii(resume.about), marginX, doc.y, { width: contentWidth });
doc.y += 6;

const contactItems = [
  resume.location ? { label: resume.location } : null,
  resume.contact?.email
    ? { label: resume.contact.email, href: `mailto:${resume.contact.email}` }
    : null,
  resume.personalWebsiteUrl
    ? { label: printableUrl(resume.personalWebsiteUrl), href: cleanUrl(resume.personalWebsiteUrl) }
    : null,
  ...(resume.contact?.social ?? []).map((social) => ({
    label: printableUrl(social.url),
    href: cleanUrl(social.url),
  })),
].filter(Boolean);

drawContactBlock(contactItems);
doc.y += 10;

// Summary
drawSectionHeading("Summary", 48);
drawBody(resume.summary, { size: 9.6, lineGap: 2.3 });
doc.y += 10;

// Work Experience
drawSectionHeading("Work Experience", 90);
for (const item of resume.work) {
  drawWorkItem(item);
}

// Skills
drawSectionHeading("Skills", 60);
drawSkillRow("Programming Languages", resume.skills.programmingLanguages);
drawSkillRow("Mobile & Architecture", resume.skills.mobile);
drawSkillRow("Tools & Platforms", resume.skills.toolbox);
doc.y += 6;

// Education
drawSectionHeading("Education", 44);
for (const item of resume.education) {
  ensureSpace(34);
  drawLeftRightRow({
    leftText: item.degree,
    rightText: `${item.start} - ${item.end}`,
    leftSize: 10,
    rightSize: 9.2,
    leftBold: true,
  });
  doc.y += 1.5;
  const schoolLine = item.gpa ? `${item.school} | GPA ${item.gpa}` : item.school;
  drawBody(schoolLine, { size: 9.4, color: colors.muted, lineGap: 1.8 });
  doc.y += 8;
}

// Projects (flows naturally without forced blank whitespace)
drawSectionHeading("Projects", 60);
for (const project of resume.projects) {
  drawProject(project);
}

// Subtle page numbering footer when multi-page
const pageRange = doc.bufferedPageRange();
if (pageRange.count > 1) {
  for (let i = 0; i < pageRange.count; i += 1) {
    doc.switchToPage(pageRange.start + i);
    const prevBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    setFont(8.2, colors.muted, false);
    doc.text(
      `Page ${i + 1} of ${pageRange.count}`,
      marginX,
      PAGE.height - 26,
      { width: contentWidth, align: "right", lineBreak: false }
    );
    doc.page.margins.bottom = prevBottomMargin;
  }
}

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log(`Generated ${path.relative(root, outputPath)} (${pageRange.count} pages)`);
