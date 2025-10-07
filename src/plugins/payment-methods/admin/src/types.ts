export interface PaymentMethodType {
  id?: number;
  documentId?: string;
  name: string;
  description?: string;
  enabled: boolean;
  options?: {
    [key: string]: any;
  };
}
