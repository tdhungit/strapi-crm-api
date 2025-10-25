export interface CampaignActionType {
  id?: number;
  documentId?: string;
  name: string;
  campaign: any;
  user?: any;
  action_status?: string;
  field_name?: string;
  target_field_name?: string;
  total?: number;
  success?: number;
  error?: number;
  metadata?: any;
  run_at?: Date;
  schedule?: any;
}

export interface CampaignActionRunResult {
  status: string;
  data: any;
}
