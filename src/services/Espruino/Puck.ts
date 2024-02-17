export const EspruinoPuck = Puck;

interface Connection {
  on: (evt: 'close' | 'data' | 'open', cb: (data: unknown) => void) => void;
  emit: (evt: 'close' | 'data' | 'open', data: unknown) => void;
  isOpen: boolean;
  isOpening: boolean;
  txInProgress: boolean;
}

declare const Puck: {
  debug: number,
  increaseMTU : boolean,
  flowControl : boolean,
  log : (level: number, s: string) => void;
  writeProgress : (charsSent: number, charsTotal: number) => void;
  connect : (cb: (connection: Connection) => void) => void,
  write : {
    (data: string, cb: (connection: Connection) => void): void;
    (data: string): Promise<void>;
  }
  eval : {
    (data: string, cb: (connection: Connection) => void): void;
    (data: string): Promise<void>;
  }
  setTime : {
    (cb: (connection: Connection) => void): void;
    (): Promise<void>;
  }
  isConnected : () => boolean;
  getConnection : () => Connection;
  close : () => void;
  modal : () => void;
};
