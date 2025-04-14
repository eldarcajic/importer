'use client';

import dynamic from 'next/dynamic';

const CSVImporter = dynamic(
  () => import('csv-import-react').then((mod) => mod.CSVImporter),
  {
    ssr: false,
  },
);
import { CsvModalProps } from '@/types/csv-import-types';
import { csvTemplates } from '@/app/csv-templates/templates';

export const CsvImportModal = ({
  isOpen,
  table,
  onUploadFile,
  onClose,
}: CsvModalProps) => {
  const template = csvTemplates.find(
    (template) => template.tableName === table?.name,
  );

  return (
    <>
      <CSVImporter
        modalIsOpen={isOpen}
        modalOnCloseTriggered={onClose}
        skipHeaderRowSelection
        darkMode={true}
        onComplete={(data) => {
          onUploadFile(data);
          onClose();
        }}
        template={template}
      />
    </>
  );
};
