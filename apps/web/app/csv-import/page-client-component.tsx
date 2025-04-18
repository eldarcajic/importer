"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import { ChevronRight, Download } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, Stepper, UploadCsvCard } from "@/components/ui";
import { csvTemplates } from "@/constants/csv-templates";
import { importTables } from "@/constants/import-tables";
import { uploadCSVSteps } from "@/constants/upload-csv-steps";
import { Data, Table } from "@/types";
import { useCsvData } from "@/lib/providers/CsvDataContext";
import { useRouter } from "next/navigation";

export const CSVImportClientPage = () => {
  const [data, setData] = useState<Data[]>([]);
  const [activeUploadStep, setActiveUploadStep] = useState(
    uploadCSVSteps[0]?.step || 1,
  );
  const [completedUploadSteps, setCompletedUploadSteps] = useState<number[]>(
    [],
  );
  const { onDataChange } = useCsvData();
  const router = useRouter();

  const activeTableType = useMemo(() => {
    const step = uploadCSVSteps.find((step) => step.step === activeUploadStep);
    const table = importTables.find((table) => table.label === step?.label);
    return table ? table.tableType : null;
  }, [activeUploadStep]);

  const areFilesUploaded = useMemo(
    () => uploadCSVSteps.length === completedUploadSteps.length,
    [uploadCSVSteps, completedUploadSteps],
  );

  const handleProceed = () => {
    onDataChange(data);
    router.push("/csv-import/review");
  };

  const handleUploadFile = (dataSet: any) => {
    const newData = {
      tableName: activeTableType || "",
      data: dataSet,
    };

    let nextActiveStep = activeUploadStep + 1;

    while (completedUploadSteps.includes(nextActiveStep)) {
      nextActiveStep++;
    }

    setData((prevData) => [...prevData, newData]);
    setActiveUploadStep(() => nextActiveStep);
    setCompletedUploadSteps((prevSteps) => [...prevSteps, activeUploadStep]);
  };

  const handleDeleteFile = (table: Table) => {
    setData((prevData) =>
      prevData.filter((item) => item.tableName !== table.tableType),
    );

    const removedStep = uploadCSVSteps.find(
      (step) => step.label === table.label,
    );

    const nextActiveStep =
      removedStep?.step! < activeUploadStep
        ? removedStep?.step
        : activeUploadStep;

    setActiveUploadStep(() => nextActiveStep ?? 1);
    setCompletedUploadSteps((prevSteps) =>
      prevSteps.filter((step) => step !== removedStep?.step),
    );
  };

  const handleDownloadTemplates = async () => {
    const zip = new JSZip();

    importTables.forEach((table) => {
      const csvContent =
        csvTemplates[table.templateName as keyof typeof csvTemplates] || ``;
      zip.file(`${table.tableType}-Table.csv`, csvContent);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "csv-templates.zip");
  };

  return (
    <div className="flex h-full w-7xl flex-col items-center justify-start gap-16 py-12">
      <Stepper
        steps={uploadCSVSteps}
        activeStep={activeUploadStep}
        completedSteps={completedUploadSteps}
      />

      <div className="flex h-full w-full flex-col items-center justify-start gap-8">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div>
            {!areFilesUploaded ? (
              <>
                <span className="text-muted-foreground text-2xl">
                  Please upload the following CSV file: {` `}
                </span>
                <span className="text-primary text-2xl font-semibold">
                  {activeTableType}-Table.csv
                </span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground text-2xl">
                  All files are uploaded. Please
                </span>
                <span className="text-primary text-2xl font-semibold">
                  {" "}
                  Proceed{" "}
                </span>
                <span className="text-muted-foreground text-2xl">
                  to validate them.
                </span>
              </>
            )}
          </div>
          <Button onClick={handleDownloadTemplates}>
            <Download />
            <span>Download templates</span>
          </Button>
        </div>
      </div>
      <div className="mt-12 flex h-full w-full max-w-7xl flex-row items-center justify-start gap-8">
        {importTables.map((table) => (
          <UploadCsvCard
            key={table.id}
            table={table}
            activeTableType={activeTableType}
            uploaded={completedUploadSteps.includes(table.id)}
            onDeleteFile={handleDeleteFile}
            onUploadFile={handleUploadFile}
          />
        ))}
      </div>

      <Button
        className="self-end"
        disabled={!areFilesUploaded}
        onClick={handleProceed}
      >
        <span>Proceed</span>
        <ChevronRight />
      </Button>
    </div>
  );
};
