"use client";

import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { csvData } from "@/constants/csv-data";
import { ChevronRight } from "lucide-react";

export type tempDataType = {
  tableName: string;
  data: Record<string, string | undefined>[];
};

export const Review = () => {
  return (
    <div className="box-border flex h-screen w-full flex-col items-center justify-start gap-8 px-20 py-12">
      <h1 className="text-primary text-4xl">Data review</h1>
      <p className="text-muted-foreground text-lg">
        Please review the data you've uploaded to make sure it's correct or to
        resolve potential errors.
      </p>
      <Tabs defaultValue={csvData[0]?.tableName} className="h-full w-full">
        <TabsList className="h-12 w-full rounded-xl px-3 py-1.5">
          {csvData.map((table) => (
            <TabsTrigger key={table.tableName} value={table.tableName}>
              {table.tableName}
            </TabsTrigger>
          ))}
        </TabsList>

        {csvData.map((table) => (
          <TabsContent
            className="flex w-full grow"
            key={table.tableName}
            value={table.tableName}
          >
            <Grid data={table} />
          </TabsContent>
        ))}
      </Tabs>

      <Button className="self-end">
        <span>Proceed</span>
        <ChevronRight />
      </Button>
    </div>
  );
};
