export interface ILabel {
  _id: string;
  name: string;
  description: string;
  logoUrl: string;
  sector: string;
  status: "active" | "inactive";
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
  logoUrl: string;
  website: string;
  labelId: string | ILabel;
  certificationDate: string;
  expiryDate: string;
  score: number | null;
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

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
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
