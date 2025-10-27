export interface WorkflowType {
  id: number;
  documentId: string;
  name: string;
  module: string;
  trigger: string;
  workflow_status: string;
  run_status: string;
  run_at: Date;
  metadata: Record<string, any>;
  workflow_actions: WorkflowActionType[];
}

export interface WorkflowActionType {
  id: number;
  documentId: string;
  name: string;
  action_status: string;
  run_status: string;
  is_repeat: boolean;
  metadata: Record<string, any>;
}

export interface WorkflowActionRunResult {
  status: string;
  metadata: Record<string, any>;
}
