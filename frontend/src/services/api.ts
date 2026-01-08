import axios from 'axios';
import type { AuthResponse, Book, Author, Category, User, CreateBookDto, CreateAuthorDto, CreateCategoryDto } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(email: string, password: string, name: string, role?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
      role,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export const booksService = {
  async getAll(): Promise<Book[]> {
    const response = await api.get<Book[]>('/books');
    return response.data;
  },

  async getById(id: number): Promise<Book> {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  async uploadImage(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/upload`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        // Don't set Content-Type - let axios set it automatically with boundary
      },
    });
    return response.data;
  },

  async create(data: CreateBookDto): Promise<Book> {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateBookDto>): Promise<Book> {
    const response = await api.patch<Book>(`/books/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  },
};

export const authorsService = {
  async getAll(): Promise<Author[]> {
    const response = await api.get<Author[]>('/authors');
    return response.data;
  },

  async getById(id: number): Promise<Author> {
    const response = await api.get<Author>(`/authors/${id}`);
    return response.data;
  },

  async create(data: CreateAuthorDto): Promise<Author> {
    const response = await api.post<Author>('/authors', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateAuthorDto>): Promise<Author> {
    const response = await api.patch<Author>(`/authors/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/authors/${id}`);
  },
};

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateCategoryDto>): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: { email: string; password: string; name: string; role?: string }): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async update(id: number, data: Partial<{ email: string; password: string; name: string; role?: string }>): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

