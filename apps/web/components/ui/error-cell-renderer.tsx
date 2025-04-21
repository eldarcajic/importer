import React, { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { CheckIcon, Eye } from "lucide-react";
import { Row } from "@/types";
import { ICellRenderer, ICellRendererParams } from "ag-grid-community";

// Custom cell renderer for the "error" column
interface ErrorCellRendererProps {
  data: Row;
}

export const ErrorCellRenderer = ({ data }: ICellRendererParams) => {
  const error = data?.error;

  if (!error) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-3">
        <CheckIcon className="text-green-500" />
        <span>All good!</span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="bg-red-700 text-white hover:bg-red-500"
          >
            <Eye />
            View Errors
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Errors</h4>
              <div className="text-muted-foreground text-sm">
                {typeof error === "string" ? (
                  <ul className="flex flex-col gap-2">
                    {error.split(";").map((x, i) => (
                      <li key={i}>
                        {i + 1}. {x}
                      </li>
                    ))}
                  </ul>
                ) : (
                  JSON.stringify(error)
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
