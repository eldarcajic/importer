"use client";

import { useRef } from "react";
import { Table, TableType, ImporterDataset } from "@/types";
import { Card } from "../ui";
import { CircleX, FileSpreadsheet, Plus } from "lucide-react";
import Papa from "papaparse";

type UploadCsvCardProps = {
  table: Table;
  activeTableType: TableType | null;
  uploaded?: boolean;
  onDeleteFile: (table: Table) => void;
  onUploadFile: (data: any, tableType: string) => void;
};

export const UploadCsvCard = ({
  table,
  activeTableType,
  uploaded,
  onDeleteFile,
  onUploadFile,
}: UploadCsvCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const disabled = uploaded || activeTableType !== table.tableType;

  const handleCardClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data;
          onUploadFile(parsedData, table.tableType);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
        },
      });
    }
  };

  return (
    <Card
      className={`relative flex h-72 w-full flex-col items-center justify-center border-2 p-0 transition duration-200 ease-in-out ${
        disabled
          ? "border-muted"
          : "hover:border-border border-muted-foreground border-dashed"
      }`}
    >
      <button
        className="h-full w-full cursor-pointer p-4"
        onClick={handleCardClick}
        disabled={disabled}
      >
        {uploaded ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6">
            <div className="text-xl text-gray-400">{table.label}</div>
            <FileSpreadsheet className="h-full w-full text-green-700" />
          </div>
        ) : (
          <Plus
            className={`h-full w-full ${disabled ? "text-muted" : "text-muted-foreground"}`}
          />
        )}
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {uploaded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFile(table);
          }}
        >
          <CircleX className="absolute top-2 right-2 h-8 w-8 cursor-pointer text-red-500" />
        </button>
      )}
    </Card>
  );
};
