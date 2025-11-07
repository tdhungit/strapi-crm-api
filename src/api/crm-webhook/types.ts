export interface WebhookType {
  id: number;
  name: string;
  uid: string;
  trigger: string;
  webhook: string;
  token?: string;
  status: string;
}
