import { MenuItem } from './menu';

export interface Menu {
  id: string;
  startDate: string;
  endDate: string;
  periodicity: string;
  isPublished: boolean;
  days?: MenuDay[];
}

export interface MenuDay {
  id: string;
  date: string;
  menuId: string;
  options?: MenuOption[];
}

export interface MenuOption {
  id: string;
  menuDayId: string;
  productId: number;
  product?: MenuItem;
  shifts?: any[]; // Using any[] for now, will refine if a Shift type is available
}

export interface CreateMenuDto {
  startDate: string;
  endDate: string;
  periodicity: string;
}

export interface UpdateMenuDto {
  startDate?: string;
  endDate?: string;
  periodicity?: string;
  isPublished?: boolean;
}

export interface AddMenuOptionDto {
  menuId: string;
  date: string;
  productId: number;
  shiftIds: number[];
}
