export interface CampaignType {
  id?: number;
  documentId?: string;
  name: string;
  campaign_type?: string;
  campaign_status?: string;
  assigned_user?: any;
  description?: string;
  leads?: any[];
  contacts?: any[];
  created_at?: Date;
  updated_at?: Date;
}
