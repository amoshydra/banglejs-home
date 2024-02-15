import { useNavigate } from "react-router-dom";
import { AppItem } from "../../api/banglejs/interface"
import { Modal } from "./Modal";
import { AppDetailView } from "./AppDetailView";

export interface AppListItemDetailViewProps {
  apps: AppItem[];
  app: AppItem | null;
  isLoading: boolean;
  error: Error | null;
}

export const AppListItemDetailView = (p: AppListItemDetailViewProps) => {

  const children = (() => {
    if (p.isLoading) {
      return (
        <div>Loading...</div>
      )
    }

    if (p.error) {
      return (
        <div>Error!</div>
      )
    }

    if (p.app === null) {
      return (
        <div>404 not found</div>
      )
    }

    return <AppDetailView app={p.app} apps={p.apps} />
  })();

  const navigate = useNavigate()


  return (
    <Modal
      onDismiss={() => {
        navigate("/apps")
      }}
    >
      <div>
        {children}
      </div>
    </Modal>
  )
};

