import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICellRendererParams } from "ag-grid-community";

export const CellRenderer = ({ data, value, column }: ICellRendererParams) => {
  const colDef = column?.getColDef();
  const field = colDef?.field;
  const headerName = colDef?.headerName;

  const cellError = data?.error
    ? data.error.split(";").filter((error: string) => {
        const [fieldsPart] = error.split(":", 1);
        if (!fieldsPart) return false;
        const errorFields = fieldsPart.split(",").map((f) => f.trim());
        return (
          errorFields.includes(field ?? "") ||
          errorFields.includes(headerName ?? "")
        );
      })
    : [];

  return (
    <div
      className={`flex h-full w-full items-center rounded-md px-4 ${
        cellError.length ? "border border-red-700" : ""
      }`}
    >
      {cellError.length ? (
        <Tooltip>
          <TooltipTrigger className="h-full w-full">
            <div className="flex h-full w-full justify-start">{value}</div>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-muted-foreground-muted border-muted-foreground border">
            <ul>
              {cellError.map((error: string, i: number) => (
                <li key={i}>
                  {i + 1}. {error}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
};
