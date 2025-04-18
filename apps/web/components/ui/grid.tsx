import { darkTheme } from "@/constants/table-theme";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { ErrorCellRenderer } from "./error-cell-renderer";
import { Data } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);
type GridProps = {
  data: Data;
};

export const Grid = ({ data }: GridProps) => {
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
        const isErrorCol = col === "error";
        return {
          field: col,
          flex: 1,
          minWidth: 250,
          pinned: isErrorCol,
          editable: isErrorCol ? false : true,
          cellRenderer: isErrorCol ? ErrorCellRenderer : undefined,
        };
      });
    }, [columns, hasErrors]);

    return colDefs;
  };

  const onCellValueChanged = (params: any) => {
    const updatedData = {
      tableName: data.tableName,
      data: params.api.getRowNode(params.node.id).data, // Get the updated row data
    };

    console.log(updatedData);
  };

  return (
    <div className="ag-theme-alpine h-full w-full">
      <AgGridReact
        columnDefs={GridColumnDefs({ columns, hasErrors })}
        defaultColDef={defaultColDef}
        rowData={data.data}
        theme={darkTheme}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};
