import React, { createContext, useMemo, useState } from 'react';
import { Elusiv } from '@elusiv/sdk';
import { noop } from 'lodash';
import { Connection, Keypair } from '@solana/web3.js';

export interface AppProviderProps {}

interface Props {
  children: React.ReactNode;
  wallet: {
    elusiv: Elusiv;
    setElusiv: (elusiv: Elusiv) => void;
    keypair: Keypair;
    setKeypair: (keypair: Keypair) => void;
    conn: Connection;
    setConnection: (conn: Connection) => void;
  };
}

export const AppContext = createContext<AppProviderProps>({
  elusiv: undefined,
  setElusiv: noop,
  keypair: undefined,
  setKeypair: noop,
  conn: undefined,
  setConnection: noop,
});

export function AppContextProvider({ children }: Props) {
  const [elusiv, setElusiv] = useState<Elusiv | undefined>();
  const [keypair, setKeypair] = useState<Keypair | undefined>();
  const [conn, setConnection] = useState<Connection | undefined>();

  const memoizedValue = useMemo(
    () => ({
      elusiv,
      setElusiv,
      keypair,
      setKeypair,
      conn,
      setConnection,
    }),
    [elusiv, setElusiv, keypair, setKeypair, conn, setConnection]
  );

  return (
    <AppContext.Provider value={{ ...memoizedValue }}>
      {children}
    </AppContext.Provider>
  );
}
