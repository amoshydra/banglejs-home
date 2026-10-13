import { useMemo, useState } from "react";
import { css } from "@emotion/react";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faMagnifyingGlass, faRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { UiButton } from "../../components/Buttons/UiButton";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { DeviceRequiredState } from "../../components/DeviceRequiredState/DeviceRequiredState";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";
import { runOperation } from "../../services/operations";
import { errorMessage } from "../../services/errorMessage";
import {
  WatchFile,
  deleteWatchFile,
  formatBytes,
  getStorageFree,
  listWatchFiles,
  readWatchFile,
} from "../../services/Espruino/files";

const iconButtonCss = css`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  border: none;
  border-radius: 9px;
  background: #1a1a1a;
  color: inherit;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const FilesScreen = () => {
  const device = useEspruinoDeviceInfoStore(state => state.device);

  const [query, setQuery] = useState("");
  const [openFile, setOpenFile] = useState<WatchFile | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    device ? ["/watch-files", device.uid] : null,
    async () => {
      const [files, free] = await Promise.all([listWatchFiles(), getStorageFree()]);
      return { files, free };
    },
  );

  const files = useMemo(() => data?.files ?? [], [data]);
  const free = data?.free ?? null;

  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return files;
    return files.filter(file => file.name.toLowerCase().includes(needle));
  }, [files, query]);

  const storageFiles = visibleFiles.filter(file => file.kind === "storage");
  const appendFiles = visibleFiles.filter(file => file.kind === "storagefile");

  if (!device) {
    return (
      <DeviceRequiredState
        icon={faFolder}
        message="Connect a watch to browse its files."
      />
    );
  }

  return (
    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          flex: 0 0 auto;
          display: flex;
          gap: 0.5rem;
          padding: 0.6rem;
        `}
      >
        <div
          css={css`
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
            background: #1a1a1a;
            border-radius: 9px;
            padding: 0 0.6rem;
            color: rgba(255, 255, 255, 0.55);
          `}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            aria-label="Filter files"
            placeholder="filter files"
            value={query}
            onChange={e => setQuery(e.target.value)}
            css={css`
              flex: 1 1 auto;
              min-width: 0;
              border: none;
              outline: none;
              background: transparent;
              color: inherit;
              font: inherit;
              font-size: 0.8rem;
              padding: 0.55rem 0;
            `}
          />
        </div>
        <button
          type="button"
          aria-label="Refresh"
          onClick={() => mutate()}
          disabled={isLoading}
          css={iconButtonCss}
        >
          <FontAwesomeIcon icon={faRotate} spin={isLoading} />
        </button>
      </div>

      <div
        css={css`
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
        `}
      >
        {error && (
          <div
            css={css`
              margin: 0 0.6rem 0.6rem;
              padding: 0.6rem 0.75rem;
              border-radius: 9px;
              background: rgba(183, 31, 31, 0.18);
              color: #f0a3a3;
              font-size: 0.8rem;
            `}
          >{errorMessage(error)}</div>
        )}

        <div
          css={css`
            padding: 0.25rem 0.75rem 0.5rem;
            font-size: 0.75rem;
            opacity: 0.55;
          `}
        >
          {isLoading && files.length === 0
            ? "Reading…"
            : free !== null
              ? `${formatBytes(free)} free`
              : `${files.length} files`}
        </div>

        {storageFiles.length > 0 && (
          <Section title="Storage files">
            {storageFiles.map(file => (
              <FileRow key={`storage:${file.name}`} file={file} onOpen={setOpenFile} />
            ))}
          </Section>
        )}

        {appendFiles.length > 0 && (
          <Section title="Storage files (append)">
            {appendFiles.map(file => (
              <FileRow key={`sf:${file.name}`} file={file} onOpen={setOpenFile} />
            ))}
          </Section>
        )}

        {!isLoading && visibleFiles.length === 0 && !error && (
          <div
            css={css`
              padding: 2rem;
              text-align: center;
              opacity: 0.5;
              font-size: 0.85rem;
            `}
          >{files.length === 0 ? "No files on the watch." : "No files match your filter."}</div>
        )}
      </div>

      {openFile && (
        <FileViewer
          key={`${openFile.kind}:${openFile.name}`}
          file={openFile}
          onClose={() => setOpenFile(null)}
          onDeleted={async () => {
            setOpenFile(null);
            await mutate();
          }}
        />
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <div
      css={css`
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        opacity: 0.55;
        padding: 0.6rem 0.75rem 0.25rem;
      `}
    >{title}</div>
    {children}
  </>
);

const FileRow = ({ file, onOpen }: { file: WatchFile; onOpen: (file: WatchFile) => void }) => (
  <button
    type="button"
    onClick={() => onOpen(file)}
    css={css`
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.65rem 0.75rem;
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      &:active {
        background: rgba(0, 0, 0, 0.2);
      }
    `}
  >
    <FontAwesomeIcon icon={faFolder} css={css`opacity: 0.5;`} />
    <span
      css={css`
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.8rem;
      `}
    >{file.name}</span>
  </button>
);

const FileViewer = ({ file, onClose, onDeleted }: {
  file: WatchFile;
  onClose: () => void;
  onDeleted: () => void;
}) => {
  const { data: content, error } = useSWR(
    ["/watch-file", file.kind, file.name],
    () => readWatchFile(file),
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const remove = async () => {
    if (!window.confirm(`Delete ${file.name}? This can't be undone.`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await runOperation(`Deleting ${file.name}`, () => deleteWatchFile(file));
      onDeleted();
    } catch (e) {
      setDeleteError(errorMessage(e));
      setDeleting(false);
    }
  };

  return (
    <BottomSheet open onDismiss={onClose} label={`File ${file.name}`}>
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      `}
    >
      <span
        css={css`
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.8rem;
        `}
      >{file.name}</span>
      <button type="button" aria-label="Close" onClick={onClose} css={iconButtonCss}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>

    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        padding: 0.75rem 1rem;
      `}
    >
      {error ? (
        <div css={css`color: #f0a3a3; font-size: 0.8rem;`}>{errorMessage(error)}</div>
      ) : content === undefined ? (
        <div css={css`opacity: 0.5; font-size: 0.85rem;`}>Reading…</div>
      ) : (
        <pre
          css={css`
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 0.75rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          `}
        >{content || "(empty)"}</pre>
      )}
    </div>

    <div
      css={css`
        flex: 0 0 auto;
        padding: 0.75rem 1rem 1rem;
      `}
    >
      {deleteError && (
        <div css={css`color: #f0a3a3; font-size: 0.8rem; margin-bottom: 0.5rem;`}>{deleteError}</div>
      )}
      <UiButton
        fullWidth
        disabled={deleting}
        onClick={remove}
        css={css`
          background: #7f1d1d;
        `}
      >
        {deleting ? "Deleting…" : "Delete file"}
      </UiButton>
    </div>
    </BottomSheet>
  );
};
