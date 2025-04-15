'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Stepper, UploadCsvCard, Button } from '@/components/ui';
import { uploadCSVSteps } from '@/constants/upload-csv-steps';
import { Table, Data, ImporterDataset } from '@/types';
import { importTables } from '@/constants/import-tables';
import { csvTemplates } from '@/constants/csv-templates';

export const CSVImportClientPage = () => {
  const [data, setData] = useState<Data[]>([]);
  const [activeUploadStep, setActiveUploadStep] = useState(
    uploadCSVSteps[0]?.step || 1,
  );
  const [completedUploadSteps, setCompletedUploadSteps] = useState<number[]>(
    [],
  );

  const activeTableType = useMemo(() => {
    const step = uploadCSVSteps.find((step) => step.step === activeUploadStep);
    const table = importTables.find((table) => table.label === step?.label);
    return table ? table.tableType : null;
  }, [activeUploadStep]);

  const areFilesUploaded = useMemo(
    () => uploadCSVSteps.length === completedUploadSteps.length,
    [uploadCSVSteps, completedUploadSteps],
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleUploadFile = (dataSet: any) => {
    const newData = {
      tableName: activeTableType || '',
      data: dataSet,
    };

    let nextActiveStep = activeUploadStep + 1;

    while (completedUploadSteps.includes(nextActiveStep)) {
      nextActiveStep++;
    }

    setData((prevData) => [...prevData, newData]);
    setActiveUploadStep((prevStep) => nextActiveStep);
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

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'csv-templates.zip');
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-16 py-12">
      <Stepper
        steps={uploadCSVSteps}
        activeStep={activeUploadStep}
        completedSteps={completedUploadSteps}
      />

      <div className="flex flex-col items-center justify-start w-full h-full gap-8">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div>
            {!areFilesUploaded ? (
              <>
                <span className="text-2xl text-gray-500">
                  Please upload the following CSV file: {` `}
                </span>
                <span className="text-2xl text-primary font-semibold ">
                  {activeTableType}-Table.csv
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl text-gray-500">
                  All files are uploaded. Please{' '}
                </span>
                <span className="text-2xl text-primary font-semibold">
                  Proceed{' '}
                </span>
                <span className="text-2xl text-gray-500">
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
      <div className="flex flex-row items-center justify-start w-full max-w-7xl h-full gap-8 mt-12">
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
      <div className="flex flex-row items-center justify-end w-full max-w-7xl h-full gap-8 mt-12">
        <Button disabled={!areFilesUploaded}>
          <span>Proceed</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
