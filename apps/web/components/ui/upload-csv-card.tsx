import { Step, Table, TableType } from '@/types';
import { Button, Card } from '../ui';
import { CircleX, FileSpreadsheet, Plus } from 'lucide-react';

type UploadCsvCardProps = {
  table: Table;
  activeTableType: TableType | null;
  uploaded?: boolean;
  onDeleteFile: (table: Table) => void;
  openImporter: (table: Table) => void;
};

export const UploadCsvCard = ({
  table,
  activeTableType,
  uploaded,
  openImporter,
  onDeleteFile,
}: UploadCsvCardProps) => {
  const disabled = uploaded || activeTableType !== table.tableType;

  return (
    <Card
      className={`w-full h-72 flex p-0 flex-col items-center justify-center border-2 transition duration-200 ease-in-out relative ${disabled ? 'border-gray-600' : 'hover:border-gray-400 border-dashed border-gray-300'}`}
    >
      <button
        className="cursor-pointer w-full h-full p-4"
        onClick={() => openImporter(table)}
        disabled={disabled}
      >
        {uploaded ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-6">
            <div className="text-xl text-gray-400">{table.label}</div>
            <FileSpreadsheet className="w-full h-full text-green-700" />
          </div>
        ) : (
          <Plus
            className={`w-full h-full  ${disabled ? 'text-gray-700' : 'text-gray-500'}`}
          />
        )}
      </button>
      {uploaded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFile(table);
          }}
        >
          <CircleX className="absolute top-2 right-2 w-8 h-8 text-red-500 cursor-pointer" />
        </button>
      )}
    </Card>
  );
};
