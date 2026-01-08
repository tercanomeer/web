export const UserRoleValues = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type UserRole = typeof UserRoleValues[keyof typeof UserRoleValues];

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description?: string;
  quantity: number;
  imageUrl?: string;
  author: Author;
  authorId: number;
  categories: Category[];
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  description?: string;
  quantity: number;
  authorId: number;
  categoryIds?: number[];
  imageUrl?: string;
}

export interface CreateAuthorDto {
  name: string;
  bio?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

