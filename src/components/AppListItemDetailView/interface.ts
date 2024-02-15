import { AppItem } from "../../api/banglejs/interface";

export interface AppDetailViewProps {
  apps: AppItem[];
  app: AppItem;
  className?: string;
}
