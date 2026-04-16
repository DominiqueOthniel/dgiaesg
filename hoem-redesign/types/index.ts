export type LocalizedString = string | { fr: string; en: string; [key: string]: string };

export interface ILabel {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  logoUrl?: string | null;
  sector: string;
  status: "active" | "inactive";
  publishDate?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  sector: LocalizedString;
  region: LocalizedString;
  logoUrl?: string | null;
  website?: string | null;
  labelId: string | ILabel;
  certificationDate: string;
  expiryDate: string;
  score: number | null;
  socialScore?: number;
  governanceScore?: number;
  status: "certified" | "pending" | "expired" | LocalizedString;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INews {
  _id: string;
  title: { fr: string; en: string };
  slug: string;
  content: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  author: string;
  imageUrl: string;
  category?: string | { _id: string; name: string };
  sector?: string;
  readingTime?: string;
  published: boolean;
  premium: boolean;
  publishedAt: string | null;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMultimedia {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  type: "video" | "audio";
  embedUrl: string;
  coverImageUrl: string;
  sector: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IEvent {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  type: "workshop" | "conference" | "training" | "networking" | "certification" | "other";
  startDate: string;
  endDate: string;
  location: LocalizedString;
  organizer: LocalizedString;
  imageUrl?: string;
  registrationUrl?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyReview {
  _id: string;
  title: LocalizedString;
  coverImageUrl: string;
  pdfUrl: string;
  publishDate: string;
  featured: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
