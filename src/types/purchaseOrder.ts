export interface PurchaseOrderItem {
  id?: number;
  productId: number; // Can be ingredientId or menuItemId
  productType: 'INGREDIENT' | 'MENU_ITEM';
  name: string; // Name of the ingredient or menu item
  quantity: number;
  unitCost: number;
  lot?: string;
  expirationDate?: string; // ISO date string
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  orderDate: string; // ISO date string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  receivedDate?: string; // ISO date string
  items: PurchaseOrderItem[];
  totalAmount: number;
  companyId: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: number;
  orderDate: string; // ISO date string
  notes?: string;
  items: Array<{
    productId: number;
    productType: 'INGREDIENT' | 'MENU_ITEM';
    quantity: number;
    unitCost: number;
    lot?: string;
    expirationDate?: string; // ISO date string
  }>;
}

export interface UpdatePurchaseOrderDto extends Partial<CreatePurchaseOrderDto> {}
