export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    UPLOAD_MENU: '/api/upload-menu',
    GET_MENUS: '/api/menus',
    GET_MENU: (id: string) => `/api/menus/${id}`,
    DELETE_MENU: (id: string) => `/api/menus/${id}`,
    CHECK_FILENAME: (filename: string) => `/api/check-filename/${encodeURIComponent(filename)}`,
  },
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg'] as string[],
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'] as string[],
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Please select an image file (PNG, JPG, JPEG)',
  UPLOAD_FAILED: 'Failed to process menu. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  DUPLICATE_FILE: 'This menu has already been uploaded to the system.',
} as const;
