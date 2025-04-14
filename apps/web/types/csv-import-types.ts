export type TableType =
  | 'Attribute'
  | 'Contact'
  | 'Deal'
  | 'Organization'
  | 'Stage';

export type CsvModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadFile: (dataSet: ImporterDataset) => void;
  table: Table | null;
};

export type Table = {
  id: number;
  name: string;
  label: string;
  tableType: TableType;
  templateName: string;
  uploaded: boolean;
};

export type Data = {
  tableName: string;
  data: ImporterDataset;
};

export type ImporterDataset = {
  num_rows: number;
  num_columns: number;
  error: null | string;
  columns: {
    key: string;
    name: string;
  }[];
  rows: {
    index: number;
    values: any[];
  }[];
};
