export interface ProductFormType {
  id?: number;
  name: string;
  summary?: string;
  description: string;
  vendor?: string;
  product_category: string;
  slug: string;
  status: 'Active' | 'Inactive' | string;
  variants: ProductVariantFormType[];
  options?: ProductOptionType[];
  photos: ProductPhoto[];
}

export interface ProductVariantFormType {
  name: string;
  price: number;
  sku: string;
  taxable: boolean;
  barcode?: string;
  weight?: number;
  weight_unit?: string;
  requires_shipping?: boolean;
  options?: {
    id: number;
  }[];
  photos: ProductPhoto[];
}

export interface ProductOptionType {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface ProductPhoto {
  url: string;
  [key: string]: any;
}
