import React, { createContext, useState, ReactNode } from 'react';

type AppContextType = {
  dataReset: boolean;
  setDataReset: (reset: boolean) => void;
};

export const AppContext = createContext<AppContextType>({
  dataReset: false,
  setDataReset: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [dataReset, setDataReset] = useState(false);

  return (
    <AppContext.Provider value={{ dataReset, setDataReset }}>
      {children}
    </AppContext.Provider>
  );
};
