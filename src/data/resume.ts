import resume from "./resume.json";

export type SocialIcon = "github" | "linkedin";

export interface ResumeData {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  description: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: {
    email: string | null;
    tel: string | null;
    social: Array<{
      name: string;
      url: string;
      icon: SocialIcon;
    }>;
  };
  education: Array<{
    school: string;
    degree: string;
    start: string;
    end: string;
  }>;
  work: Array<{
    company: string;
    link: string;
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

export const RESUME_DATA = resume as ResumeData;
