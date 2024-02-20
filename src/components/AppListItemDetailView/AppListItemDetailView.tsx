import { useNavigate } from "react-router-dom";
import { AppItem } from "../../api/banglejs/interface"
import { Modal } from "../Modal/Modal";
import { AppDetailView } from "./AppDetailView";
import { css } from "@emotion/react";
import { AppDetailViewDeviceView } from "./AppDetailViewDeviceView";

export interface AppListItemDetailViewProps {
  apps: AppItem[];
  appId: string;
  isLoading: boolean;
  error: Error | null;
}

export const AppListItemDetailView = (p: AppListItemDetailViewProps) => {
  const app = p.apps.find(app => app.id === p.appId) || null;

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

    if (app === null) {
      return (
        <div>404 not found</div>
      )
    }

    return <AppDetailView app={app} apps={p.apps} />
  })();

  const navigate = useNavigate()

  return (
    <Modal
      onDismiss={() => {
        navigate("/apps")
      }}
    >
      <div
        css={css`
          padding: 1rem;
          padding-top: 2rem;
        `}
      >
        {children}
        <AppDetailViewDeviceView
          appId={p.appId}
          apps={p.apps}
        />
      </div>
    </Modal>
  )
};
