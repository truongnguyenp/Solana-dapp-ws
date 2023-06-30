import { createContext, useState } from 'react';
import { Elusiv } from '@elusiv/sdk';
import { noop } from 'lodash';

export interface AppProviderProps {}

interface Props {
  children: React.ReactNode;
  wallet: {
    elusiv: Elusiv;
    keypair: string;
    setKeypair: (keypair: string) => void;
  };
}

export const AppContext = createContext<AppProviderProps>({
  filter: {
    onClose: noop,
    onOpen: noop,
    toggleVisible: noop,
    visible: false,
  },
});

export function AppContextProvider({ children }: Props) {
  const [filterVisible, onOpenFilter, onCloseFilter, onToggleFilter] =
    useToggle(false);

  const [isPendingAsyncAction, setIsPendingAsyncAction] = useState(false);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [rangeDate, setRangeDate] = useState<RangeDate | undefined>();

  return (
    <AppContext.Provider
      value={{
        filter: {
          onClose: onCloseFilter,
          onOpen: onOpenFilter,
          toggleVisible: onToggleFilter,
          visible: filterVisible,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
