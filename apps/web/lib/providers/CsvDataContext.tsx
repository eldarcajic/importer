'use client';

import { Data } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type CsvDataContextType = {
  csvData: Data[];
  setCSVData: React.Dispatch<React.SetStateAction<Data[]>>;
  clearData: () => void;
};

const CsvDataContext = createContext<CsvDataContextType | undefined>(undefined);

export const CsvDataProvider = ({ children }: { children: ReactNode }) => {
  const [csvData, setCSVData] = useState<Data[]>([]);

  const clearData = () => setCSVData([]);

  return (
    <CsvDataContext.Provider value={{ csvData, setCSVData, clearData }}>
      {children}
    </CsvDataContext.Provider>
  );
};

export const useCsvData = () => {
  const context = useContext(CsvDataContext);
  if (!context) {
    throw new Error('useCsvData must be used within a CsvDataProvider');
  }
  return context;
};
