import { tempDataType } from '@/app/csv-import/review/page-client-component';
import { darkTheme } from '@/constants/table-theme';
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);
type GridProps = {
  data: tempDataType;
};
export const Grid = ({ data }: GridProps) => {
  const defaultColDef = {
    filter: true,
  };

  const columns = useMemo(() => {
    return data.data[0] ? Object.keys(data.data[0]) : [];
  }, []);

  const colDefs = [...columns, 'comment'].map((col) => {
    return { field: col };
  });

  return (
    <div style={{ height: 500 }}>
      <AgGridReact
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowData={data.data}
        theme={darkTheme}
      />
    </div>
  );
};
