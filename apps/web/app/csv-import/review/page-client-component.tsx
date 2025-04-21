"use client";

import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCsvData } from "@/lib/providers/CsvDataContext";
import {
  ChevronLeft,
  ChevronRight,
  FileWarning,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Review = () => {
  const { csvData, isDataLoading } = useCsvData();
  const [progress, setProgress] = useState(13);
  const router = useRouter();

  const goBack = () => {
    router.push("/csv-import");
  };

  useEffect(() => {
    const timer = setInterval(
      () => setProgress((prev) => (prev + 30 <= 95 ? prev + 30 : 95)),
      300,
    );

    if (!isDataLoading && csvData.length) {
      setProgress(100);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [csvData]);

  if (!csvData.length) {
    return (
      <div className="box-border flex h-screen w-full flex-col items-center justify-between gap-8 px-20 py-12">
        <h1 className="text-primary text-4xl">Data review</h1>
        <div className="flex flex-col items-center justify-center gap-8">
          {!isDataLoading ? (
            <>
              <p className="text-muted-foreground text-lg">
                No data found. Please go back and upload necessary files.
              </p>
              <Button onClick={goBack}>
                <ChevronLeft />
                Go Back
              </Button>
            </>
          ) : (
            <div className="flex h-full w-full flex-col gap-6">
              <p className="text-muted-foreground text-lg">
                We are preparing the data for you. Please wait.
              </p>
              <Progress value={progress} className="h-3 w-full" />
            </div>
          )}
        </div>
        <div></div>
      </div>
    );
  }

  return (
    <div className="box-border flex h-screen w-full flex-col items-center justify-start gap-8 px-20 py-12">
      <h1 className="text-primary text-4xl">Data review</h1>
      <p className="text-muted-foreground text-lg">
        Please review the data you've uploaded to make sure it's correct or to
        resolve potential errors.{" "}
        <span className="font-semibold">Double click </span>
        on cell to edit.
      </p>
      <Tabs defaultValue={csvData[0]?.tableName} className="h-full w-full">
        <TabsList className="h-12 w-full rounded-xl px-3 py-1.5">
          {csvData.map((table) => {
            const hasErrors = table.data.some((row) => row.error);

            return (
              <TabsTrigger
                className="flex flex-row gap-3"
                key={table.tableName}
                value={table.tableName}
              >
                <span>{table.tableName}</span>
                {hasErrors && (
                  <TriangleAlert className="h-6 w-6 text-orange-700" />
                )}
              </TabsTrigger>
            );
          })}
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
