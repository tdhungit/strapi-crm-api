export interface InventoryManualFormType {
  id?: number;
  documentId?: string;
  inventory_type: string;
  warehouse: number;
  inventory_status?: string;
  details: InventoryManualFormType[];
}

export interface InventoryManualFormType {
  id?: number;
  documentId?: string;
  product_variant: number;
  quantity: number;
  price?: number;
}
