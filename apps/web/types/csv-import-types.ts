export type TableType =
  | "Attribute"
  | "Contact"
  | "Deal"
  | "Organization"
  | "Stage";

export type UploadCsvCardProps = {
  table: Table;
  activeTableType: TableType | null;
  uploaded?: boolean;
  onDeleteFile: (table: Table) => void;
  onUploadFile: (data: any, tableType: string) => void;
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
  data: Row[];
};

export type Row = Record<string, string | number | Date | undefined>;
