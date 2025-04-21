"use client";

import { Progress } from "@/components/ui/progress";
import { useCsvData } from "@/lib/providers/CsvDataContext";
import { useEffect, useState } from "react";

export const Preview = () => {
  const { csvData, isDataLoading } = useCsvData();
  const [progress, setProgress] = useState(13);

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
        <h1 className="text-primary text-4xl">Data preview</h1>
        <div className="flex flex-col items-center justify-center gap-8">
          {!isDataLoading && (
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
      <h1 className="text-primary text-4xl">Data preview</h1>

      <pre>{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
};
