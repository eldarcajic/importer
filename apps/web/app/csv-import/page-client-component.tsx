'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Stepper,
  UploadCsvCard,
  CsvImportModal,
  Button,
} from '@/components/ui';
import { uploadCSVSteps } from '@/constants/upload-csv-steps';
import { Table, Data, ImporterDataset } from '@/types';
import { importTables } from '@/constants/import-tables';
import { useRouter } from 'next/navigation';
import { useCsvData } from '@/lib/providers/CsvDataContext';

export const CSVImportClientPage = () => {
  const { csvData, setCSVData } = useCsvData();
  const router = useRouter();

  const [activeUploadStep, setActiveUploadStep] = useState(
    uploadCSVSteps[0]?.step || 1,
  );
  const [completedUploadSteps, setCompletedUploadSteps] = useState<number[]>(
    [],
  );
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [data, setData] = useState<Data[]>([]);

  const activeTableType = useMemo(() => {
    const step = uploadCSVSteps.find((step) => step.step === activeUploadStep);
    const table = importTables.find((table) => table.label === step?.label);
    return table ? table.tableType : null;
  }, [activeUploadStep]);

  const handleOpenImporter = (table: Table) => {
    handleOpenModal();
  };

  const handleCloseModal = () => {
    setIsCsvModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsCsvModalOpen(true);
  };

  const handleUploadFile = (dataSet: ImporterDataset) => {
    const newData = {
      tableName: activeTableType || '',
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
  console.log(csvData);

  const handleContinue = () => {
    setCSVData(data);
    router.push('/csv-import/review');
  };

  return (
    <div className="flex flex-col items-center justify-start w-7xl h-full gap-16 py-12">
      <Stepper
        steps={uploadCSVSteps}
        activeStep={activeUploadStep}
        completedSteps={completedUploadSteps}
      />

      <div className="flex flex-col items-center justify-start w-full h-full gap-8">
        <h1 className="text-gray-300 text-2xl">
          Please upload {activeTableType?.toUpperCase()}S file
        </h1>
        <div className="flex flex-row items-center justify-start w-full max-w-7xl h-full gap-8 mt-12">
          {importTables.map((table) => (
            <UploadCsvCard
              key={table.id}
              table={table}
              openImporter={handleOpenImporter}
              activeTableType={activeTableType}
              uploaded={completedUploadSteps.includes(table.id)}
              onDeleteFile={handleDeleteFile}
            />
          ))}
        </div>
      </div>

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={handleCloseModal}
        table={
          importTables.find((table) => table.tableType === activeTableType) ||
          null
        }
        onUploadFile={handleUploadFile}
      />

      <Button
        className="self-end  text-lg"
        disabled={completedUploadSteps.length !== 5}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
};
