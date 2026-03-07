export interface ILabel {
  _id: string;
  name: string;
  description: string;
  logoUrl?: string | null;
  sector: string;
  status: "active" | "inactive";
  validationWorkflow?: { step: string; status: "complete" | "active" | "pending" }[];
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  _id: string;
  name: string;
  description: string;
  sector: string;
  region: string;
  logoUrl?: string | null;
  website?: string | null;
  labelId: string | ILabel;
  certificationDate: string;
  expiryDate: string;
  score: number | null;
  socialScore?: number;
  governanceScore?: number;
  status: "certified" | "pending" | "expired";
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICriteria {
  _id: string;
  labelId: string | ILabel;
  category: "governance" | "environment" | "social" | "economic" | "quality";
  title: string;
  description: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface INews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  category?: string;
  sector?: string;
  readingTime?: string;
  published: boolean;
  publishedAt: string | null;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyCriteria {
  _id: string;
  companyId: string | ICompany;
  criteriaId: string | ICriteria;
  score: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMultimedia {
  _id: string;
  title: string;
  description: string;
  type: "video" | "audio";
  embedUrl: string;
  coverImageUrl: string;
  sector: "finance" | "governance" | "tech" | "energy" | "leadership";
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  savedArticles: string[];
  createdAt: string;
  updatedAt: string;
}

export type LabelStatus = ILabel["status"];
export type CompanyStatus = ICompany["status"];
export type CriteriaCategory = ICriteria["category"];
export type UserRole = IUser["role"];

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
