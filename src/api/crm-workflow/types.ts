export interface WorkflowType {
  id: number;
  documentId: string;
  name: string;
  module: string;
  trigger: string;
  workflow_status: string;
  run_status: string;
  run_at: Date;
  metadata: any;
  workflow_actions: WorkflowActionType[];
}

export interface WorkflowActionType {
  id: number;
  documentId: string;
  name: string;
  action_status: string;
  run_status: string;
  is_repeat: boolean;
  metadata: any;
}

export interface WorkflowActionRunResult {
  status: string;
  message?: string;
  metadata: any;
}

export interface WorkflowConditionType {
  field: string;
  value: string;
  operator: string;
}

export interface WorkflowEmailActionType {
  actionSettings?: {
    field?: string;
    fromName?: string;
    fromEmail?: string;
    replyToEmail?: string;
    templateId?: number;
  };
}

export interface WorkflowSmsActionType {
  actionSettings?: {
    field?: string;
    templateId?: number;
  };
}
