// src/types/project.ts
export type Outcome = { label: string; value: string };
export type ImageBlock = { url: string; alt?: string; caption?: string };
export type GalleryItem = ImageBlock;
export type Persona = {
  name: string;
  role: string;
  bio: string;
  goals: string[];
  frustrations: string[];
  image?: string;
};
export type ProcessStep = {
  phase: string;
  description: string;
  image?: string;
};
export type TypographyItem = {
  name: string;
  usage: string;
  sampleText: string;
};
export type ColorItem = { name: string; hex: string; usage: string };

export type Project = {
  _id: string;
  slug: string;
  title: string;
  summary?: string;
  role?: string;
  client?: string;
  year?: number;
  duration?: string;
  team?: string[];
  tools?: string[];
  tags?: string[];
  coverImage?: string;
  coverImageAlt?: string;
  gallery?: GalleryItem[];
  links?: { live?: string; prototype?: string; figma?: string };
  introduction?: string;
  challenge?: string;
  goals?: string[];
  personas?: ImageBlock[];
  process?: ImageBlock[];
  designSystem?: ImageBlock[];
  solution?: string;
  outcomes?: Outcome[];
  reflection?: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** What the form sends: everything except server-managed fields. */
export type ProjectInput = Omit<Project, "_id" | "createdAt" | "updatedAt">;
