import { ProductPhoto } from './product';

export interface NormalizeDataType {
  vendor: { name: string };
  product_category: { name: string };
  product: any;
  product_variants: any[];
  product_attributes: any[];
  product_prices: any[];
}

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
    name: string;
    value: any;
  }[];
  photos: ProductPhoto[];
}

export interface ProductOptionType {
  id?: number;
  documentId?: string;
  name: string;
  position: number;
  values: string[];
}
