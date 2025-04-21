import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ICellRendererParams } from "ag-grid-community";
import { CheckIcon, Eye } from "lucide-react";
import React, { useMemo } from "react";

// Custom cell renderer for the "error" column

export const ErrorCellRenderer = ({ data }: ICellRendererParams) => {
  const errors: string[] = useMemo(() => {
    return data?.error?.split(";") ?? [];
  }, [data]);

  if (!errors.length) {
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
            View Errors:
            <span>{errors.length}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Errors</h4>
              <div className="text-muted-foreground text-sm">
                {errors.length ? (
                  <ul className="flex flex-col gap-2">
                    {errors.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  JSON.stringify(errors)
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
