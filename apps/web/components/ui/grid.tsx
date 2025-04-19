import { darkTheme } from "@/constants/table-theme";
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ModuleRegistry,
  GridOptions,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useCallback } from "react";
import { ErrorCellRenderer } from "./error-cell-renderer";
import { Data, Row } from "@/types";
import { useCsvData } from "@/lib/providers/CsvDataContext";
import { CellRenderer } from "./cell-renderer";
import { TooltipProvider } from "@radix-ui/react-tooltip";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridProps = {
  data: Data;
};

export const Grid = ({ data }: GridProps) => {
  const { csvData, onDataChange } = useCsvData();
  const defaultColDef = {
    filter: true,
  };

  const gridRef = useRef<AgGridReact>(null);

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

  // Function to add a new row
  const addNewRow = useCallback(() => {
    const newRow: Row = {
      id: crypto.randomUUID(), // Generate unique ID for the new row
      // Initialize other fields with empty or default values
      ...columns.reduce(
        (acc, col) => {
          if (col !== "id" && col !== "error") {
            acc[col] = "";
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
      error: "",
    };

    const updatedTables: Data[] = csvData.map((table) => {
      if (table.tableName !== data.tableName) return table;

      return {
        ...table,
        data: [...table.data, newRow],
      };
    });

    onDataChange(updatedTables);
  }, [csvData, columns, data.tableName, onDataChange]);

  // Custom full-width cell renderer for the "Add Row" button
  const fullWidthCellRenderer = useCallback(() => {
    return (
      <div className="p-2.5 text-center">
        <button onClick={addNewRow}>Add New Row</button>
      </div>
    );
  }, [addNewRow]);

  // Grid options to include pinned bottom row
  const gridOptions: GridOptions = {
    pinnedBottomRowData: [{ fullWidth: true }], // Single full-width row
    isFullWidthRow: (params) => {
      return params.rowNode.data.fullWidth === true;
    },
    fullWidthCellRenderer,
  };

  return (
    <div className="h-full w-full">
      <TooltipProvider>
        <AgGridReact
          columnDefs={GridColumnDefs({ columns, hasErrors })}
          defaultColDef={defaultColDef}
          ref={gridRef}
          rowData={data.data}
          theme={darkTheme}
          onCellValueChanged={onCellValueChanged}
          gridOptions={gridOptions}
        />
      </TooltipProvider>
    </div>
  );
};

function generateHeaderName(col: string, csvData: Data[]) {
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
}
