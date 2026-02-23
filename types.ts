
export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  achievements: string[];
  image?: string;
}

export interface Project {
  title: string;
  description: string;
  year: string;
  stack: string[];
  impact?: string;
  image?: string;
}

export interface Paper {
  title: string;
  publisher: string;
  year: string;
  type: 'National' | 'International';
  link?: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  details: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
  image?: string;
}

export interface PortfolioData {
  name: string;
  headline: string;
  summary: string;
  profileImage: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  education: {
    institution: string;
    major: string;
    period: string;
    details: string[];
  }[];
  experience: Experience[];
  skills: SkillGroup[];
  certifications: Certification[];
  projects: Project[];
  papers?: Paper[];
}
