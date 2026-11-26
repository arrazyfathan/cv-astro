import resumeEn from "./resume.json";
import resumeId from "./resume.id.json";

export type Locale = "en" | "id";
export type SocialIcon = "github" | "linkedin";

export interface ResumeData {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  availability: string;
  description: string;
  ogDescription: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: {
    email: string | null;
    tel: string | null;
    social: Array<{
      name: string;
      handle: string;
      url: string;
      icon: SocialIcon;
    }>;
  };
  education: Array<{
    school: string;
    degree: string;
    gpa?: string;
    start: string;
    end: string;
  }>;
  work: Array<{
    company: string;
    link: string;
    location?: string;
    badges: string[];
    title: string;
    start: string;
    end: string | null;
    description: {
      paragraph: string;
      bullets: string[];
    };
  }>;
  skills: {
    programmingLanguages: string[];
    mobile: string[];
    toolbox: string[];
  };
  projects: Array<{
    title: string;
    techStack: string[];
    description: string;
    link: {
      label: string;
      href: string;
    };
  }>;
}

export const RESUME_DATA = resumeEn as ResumeData;
export const RESUME_DATA_ID = resumeId as ResumeData;

export const RESUME_BY_LOCALE: Record<Locale, ResumeData> = {
  en: RESUME_DATA,
  id: RESUME_DATA_ID,
};

export const PDF_FILES: Record<Locale, { href: string; filename: string }> = {
  en: {
    href: "/CV%20-%20Ar%20Razy%20Fathan%20Rabbani.pdf",
    filename: "CV - Ar Razy Fathan Rabbani.pdf",
  },
  id: {
    href: "/CV%20-%20Ar%20Razy%20Fathan%20Rabbani%20(ID).pdf",
    filename: "CV - Ar Razy Fathan Rabbani (ID).pdf",
  },
};

export const UI_COPY = {
  en: {
    pageTitle: `${RESUME_DATA.name} — Resume`,
    downloadPdf: "Download PDF",
    website: "Website",
    copied: "Copied",
    present: "Present",
    gpa: "GPA",
    sections: {
      summary: "Summary",
      experience: "Experience",
      projects: "Selected Projects",
      skills: "Skills",
      education: "Education",
    },
    skillGroups: {
      languages: "Languages",
      mobile: "Mobile",
      tools: "Tools",
    },
    menu: {
      button: "Menu",
      searchPlaceholder: "Search actions or links...",
      actions: "Actions",
      links: "Links",
      print: "Print / Save as PDF",
      downloadEn: "Download PDF (English)",
      downloadId: "Download PDF (Bahasa Indonesia)",
      copyEmail: "Copy email",
      toggleTheme: "Toggle light / dark paper",
      toggleLanguage: "Switch language (English / Bahasa Indonesia)",
      empty: "No results found.",
    },
    downloadModal: {
      title: "Download PDF",
      subtitle: "Choose the language version you'd like to download.",
      englishLabel: "English",
      englishMeta: "ATS-friendly · A4 PDF",
      indonesianLabel: "Bahasa Indonesia",
      indonesianMeta: "Ramah ATS · A4 PDF",
      activeTag: "Current",
    },
  },
  id: {
    pageTitle: `${RESUME_DATA_ID.name} — CV`,
    downloadPdf: "Unduh PDF",
    website: "Situs Web",
    copied: "Tersalin",
    present: "Sekarang",
    gpa: "IPK",
    sections: {
      summary: "Ringkasan",
      experience: "Pengalaman",
      projects: "Proyek Pilihan",
      skills: "Keahlian",
      education: "Pendidikan",
    },
    skillGroups: {
      languages: "Bahasa",
      mobile: "Mobile",
      tools: "Alat & Platform",
    },
    menu: {
      button: "Menu",
      searchPlaceholder: "Cari aksi atau tautan...",
      actions: "Aksi",
      links: "Tautan",
      print: "Cetak / Simpan sebagai PDF",
      downloadEn: "Unduh PDF (English)",
      downloadId: "Unduh PDF (Bahasa Indonesia)",
      copyEmail: "Salin email",
      toggleTheme: "Ganti tema terang / gelap",
      toggleLanguage: "Ganti bahasa (Bahasa Indonesia / English)",
      empty: "Hasil tidak ditemukan.",
    },
    downloadModal: {
      title: "Unduh PDF",
      subtitle: "Pilih versi bahasa CV yang ingin diunduh.",
      englishLabel: "English",
      englishMeta: "ATS-friendly · A4 PDF",
      indonesianLabel: "Bahasa Indonesia",
      indonesianMeta: "Ramah ATS · A4 PDF",
      activeTag: "Aktif",
    },
  },
} as const;
