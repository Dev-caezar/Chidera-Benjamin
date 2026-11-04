// src/types/profile.ts
export type Experience = {
  company: string;
  role: string;
  period: string;
  description: string;
};

export type Profile = {
  _id?: string;
  name?: string;
  headline?: string;
  intro?: string;
  bio?: string;
  headshot?: string;
  headshotAlt?: string;
  location?: string;
  email?: string;
  resumeUrl?: string;
  availability?: { open?: boolean; note?: string };
  skills?: string[];
  socials?: Record<string, string | undefined>;
  experience?: Experience[];
  metaDescription?: string;
};
