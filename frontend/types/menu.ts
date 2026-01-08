export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
  is_main?: boolean;
}

export interface MenuData {
  menu_id?: string;
  restaurant_name: string;
  categories: MenuCategory[];
  raw_text?: string;
}

export interface MenuDisplayProps {
  menuData: MenuData;
}

export interface MenuUploadProps {
  onMenuProcessed: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface MenuSummary {
  id: string;
  restaurant_name: string;
  created_at: string;
  image_path: string;
}

export interface MenuListResponse {
  menus: MenuSummary[];
  total: number;
}
