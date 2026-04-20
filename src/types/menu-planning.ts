import type { MenuItem } from './menu';


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
  menuItemId: number;
  menuItem?: MenuItem;
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
  menuItemId: number;
  shiftIds: number[];
}
