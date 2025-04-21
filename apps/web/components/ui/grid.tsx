import { darkTheme } from "@/constants/table-theme";
import { DropdownCols, useDropdown } from "@/lib/hooks/use-dropdown";
import { useCsvData } from "@/lib/providers/CsvDataContext";
import { Data, Row } from "@/types";
import { Board, User } from "@/types/entity-types";
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ISelectCellEditorParams,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { CellRenderer } from "./cell-renderer";
import { ErrorCellRenderer } from "./error-cell-renderer";
import { TooltipProvider } from "./tooltip";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridProps = {
  data: Data;
  users?: User[];
  boards?: Board[];
};

export const Grid = ({ data, users = [], boards = [] }: GridProps) => {
  const { csvData, onDataChange } = useCsvData();
  const { DROPDOWN_COLS } = useDropdown(csvData, users, boards);
  const defaultColDef = {
    filter: true,
  };

  const columns = useMemo(() => {
    return data.data[0] ? Object.keys(data.data[0]) : [];
  }, [data]);

  const hasErrors = useMemo(() => {
    return data.data.some((row) => row.error);
  }, [data]);

  const GridColumnDefs = ({
    columns,
    hasErrors,
  }: {
    columns: string[];
    hasErrors: boolean;
  }) => {
    const colDefs = useMemo(() => {
      const uniqueColumns = columns.includes("error")
        ? columns
        : [...columns, "error"];

      return uniqueColumns.map((col) => {
        const isDropdownMaterial =
          DROPDOWN_COLS.map((col) => col.colName).some((dropdownCol) =>
            col.includes(dropdownCol),
          ) && !col.includes("_attribute_");
        const isErrorCol = col === "error";
        const isIdCol = col === "id";

        return {
          field: col,
          headerName: generateHeaderName(col, csvData),
          flex: 1,
          hide: isIdCol,
          minWidth: 250,
          pinned: isErrorCol,
          editable: isErrorCol ? false : true,
          cellRenderer: isErrorCol ? ErrorCellRenderer : CellRenderer,
          ...(isDropdownMaterial && {
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: getDropdownValues(col, DROPDOWN_COLS),
              valueListMaxHeight: 200,
            } as ISelectCellEditorParams,
          }),
        };
      });
    }, [columns, hasErrors]);

    return colDefs;
  };

  const onCellValueChanged = (params: CellValueChangedEvent<Row>) => {
    const nodeId = params.node.id ?? "";
    const updatedRow = params.api.getRowNode(nodeId)?.data;

    if (!updatedRow) return;

    const updatedTables: Data[] = csvData.map((table) => {
      if (table.tableName !== data.tableName) return table;

      return {
        ...table,
        data: table.data.map((row) =>
          row.id === updatedRow.id ? updatedRow : row,
        ),
      };
    });

    onDataChange(updatedTables);
  };

  return (
    <div className="h-full w-full">
      <TooltipProvider>
        <AgGridReact
          columnDefs={GridColumnDefs({ columns, hasErrors })}
          defaultColDef={defaultColDef}
          rowData={data.data}
          theme={darkTheme}
          onCellValueChanged={onCellValueChanged}
          suppressScrollOnNewData
        />
      </TooltipProvider>
    </div>
  );
};

const generateHeaderName = (col: string, csvData: Data[]) => {
  if (col.includes("attribute") && col !== "attribute_type") {
    const attributeTable = csvData.find(
      (table) => table.tableName === "Attribute",
    );

    const attributeName =
      attributeTable?.data.find((row) => row.identifier === col)?.title ?? col;

    return attributeName.toString().length > 0 ? attributeName.toString() : col;
  }

  return col
    .split("_")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
};

const getDropdownValues = (
  col: string,
  DROPDOWN_COLS: DropdownCols,
): string[] => {
  const dropdownCol = DROPDOWN_COLS.find((dropdownCol) =>
    col.includes(dropdownCol.colName),
  );

  const values = dropdownCol?.values ?? [];

  return values;
};
