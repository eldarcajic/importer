"use client";

import { Data, Row } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { validateData } from "../queries/api";

type CsvDataContextType = {
  csvData: Data[];
  isDataLoading: boolean;
  onDataChange: (data: Data[]) => void;
  clearData: () => void;
};

const CsvDataContext = createContext<CsvDataContextType | undefined>(undefined);

export const CsvDataProvider = ({ children }: { children: ReactNode }) => {
  const [csvData, setCSVData] = useState<Data[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: validateData,
    onError: (err) => {
      console.error("Validation error:", err);
    },
    onSuccess: (data) => {
      setCSVData(data.tables);
    },
  });

  const onDataChange = (data: Data[]) => {
    const filteredData: Data[] = [];
    for (const table of data) {
      const filteredTable = table.data.map((x) => ({
        ...x,
        error: "",
      }));

      filteredData.push({ tableName: table.tableName, data: filteredTable });
    }
    mutate(filteredData);
  };

  const clearData = () => setCSVData([]);

  return (
    <CsvDataContext.Provider
      value={{ csvData, onDataChange, clearData, isDataLoading: isPending }}
    >
      {children}
    </CsvDataContext.Provider>
  );
};

export const useCsvData = () => {
  const context = useContext(CsvDataContext);
  if (!context) {
    throw new Error("useCsvData must be used within a CsvDataProvider");
  }
  return context;
};
function setTableData(tables: any) {
  throw new Error("Function not implemented.");
}
