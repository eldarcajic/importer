import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICellRendererParams } from "ag-grid-community";

export const CellRenderer = ({ data, value, column }: ICellRendererParams) => {
  const colDef = column?.getColDef();
  const cellError = data?.error
    ? data?.error
        .split(";")
        .map((x: string) =>
          (colDef?.field && x.includes(colDef?.field)) ||
          (colDef?.headerName && x.includes(colDef?.headerName)) ||
          (value && x.includes(value))
            ? x
            : undefined,
        )
        .filter((x: string | undefined) => x !== undefined)
    : [];

  console.log(cellError);
  return (
    <div
      className={`flex h-full w-full items-center rounded-md px-2 ${cellError.length && "border border-red-700"}`}
    >
      {cellError.length ? (
        <Tooltip>
          <TooltipTrigger className="h-full w-full">
            <div className="flex h-full w-full justify-start">{value}</div>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-muted-foreground-muted border-muted-foreground border">
            <ul>
              {cellError.map((x: string, i: number) => (
                <li key={i}>
                  {i + 1}. {x}
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
