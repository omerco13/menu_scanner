import axios, { AxiosError } from 'axios';
import { MenuData, MenuSummary, MenuListResponse } from '@/types/menu';
import { API_CONFIG, ERROR_MESSAGES } from './constants';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const menuApi = {
  uploadMenu: async (file: File): Promise<MenuData> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<MenuData>(
        API_CONFIG.ENDPOINTS.UPLOAD_MENU,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail || ERROR_MESSAGES.UPLOAD_FAILED;
        throw new ApiError(message, axiosError.response?.status, error);
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
    }
  },

  getAllMenus: async (): Promise<MenuSummary[]> => {
    try {
      const response = await apiClient.get<MenuListResponse>(
        API_CONFIG.ENDPOINTS.GET_MENUS
      );
      return response.data.menus;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail || 'Failed to fetch menus';
        throw new ApiError(message, axiosError.response?.status, error);
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
    }
  },

  getMenuById: async (menuId: string): Promise<MenuData> => {
    try {
      const response = await apiClient.get<MenuData>(
        API_CONFIG.ENDPOINTS.GET_MENU(menuId)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail || 'Failed to fetch menu';
        throw new ApiError(message, axiosError.response?.status, error);
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
    }
  },

  deleteMenu: async (menuId: string): Promise<void> => {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.DELETE_MENU(menuId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail || 'Failed to delete menu';
        throw new ApiError(message, axiosError.response?.status, error);
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
    }
  },

  checkFilename: async (filename: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ exists: boolean }>(
        API_CONFIG.ENDPOINTS.CHECK_FILENAME(filename)
      );
      return response.data.exists;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail || 'Failed to check filename';
        throw new ApiError(message, axiosError.response?.status, error);
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
    }
  },
};
