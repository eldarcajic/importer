'use client';

import { Grid } from '@/components/ui/grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { csvData } from '@/constants/csv-data';

export type tempDataType = {
  tableName: string;
  data: Record<string, string | undefined>[];
};

export const Review = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-16 py-12">
      <Tabs defaultValue={csvData[0]?.tableName} className="h-full w-full">
        <TabsList className="w-full h-16">
          {csvData.map((table) => (
            <TabsTrigger key={table.tableName} value={table.tableName}>
              Account
            </TabsTrigger>
          ))}
        </TabsList>

        {csvData.map((table) => (
          <TabsContent key={table.tableName} value={table.tableName}>
            <Grid data={table} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
