export interface DashboardType {
  id: number;
  name: string;
  is_default: boolean;
  dashboard_items: DashboardItemType[];
}

export interface DashboardItemType {
  id: number;
  title: string;
  type: string;
  widget: string;
  height: number;
  weight: number;
  metadata: any;
  dashboard: DashboardType;
}
