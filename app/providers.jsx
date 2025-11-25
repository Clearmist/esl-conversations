'use client';

import { createContext, useContext, useState } from 'react';

const StateContext = createContext(undefined);

export function AppStateProvider({ children }) {
  const [helperLanguage, setHelperLanguage] = useState('pol');

  return (
    <StateContext.Provider value={{ helperLanguage, setHelperLanguage }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(StateContext);

  if (!ctx) {
    throw new Error("useAppState must be inside AppStateProvider");
  }

  return ctx;
}
