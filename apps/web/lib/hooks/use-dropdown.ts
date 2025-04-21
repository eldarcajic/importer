import { ATTRIBUTE_TYPES } from "@/constants/attribute-types";
import { Data } from "@/types";
import { Board, User } from "@/types/entity-types";
import { useMemo } from "react";

export const useDropdown = (
  csvData: Data[],
  users: User[],
  boards: Board[],
) => {
  const contacts = useMemo(() => {
    return (
      csvData
        .find((table) => table.tableName === "Contact")
        ?.data.map((row) => (row.name as string) ?? "") ?? []
    );
  }, [csvData]);

  const organizations = useMemo(() => {
    return (
      csvData
        .find((table) => table.tableName === "Organization")
        ?.data.map((row) => (row.name as string) ?? "") ?? []
    );
  }, [csvData]);

  const stages = useMemo(() => {
    return (
      csvData
        .find((table) => table.tableName === "Stage")
        ?.data.map((row) => (row.name as string) ?? "") ?? []
    );
  }, [csvData]);

  const DROPDOWN_COLS = [
    {
      colName: "attribute_type",
      values: ["", ...ATTRIBUTE_TYPES],
    },
    {
      colName: "assignee_",
      values: ["", ...users.map((user) => user.name)],
    },
    {
      colName: "contact_",
      values: ["", ...contacts],
    },
    {
      colName: "editor_",
      values: ["", ...users.map((user) => user.name)],
    },
    {
      colName: "organization_name",
      values: ["", ...organizations],
    },
    {
      colName: "board_name",
      values: ["", ...boards.map((board) => board.name)],
    },
    {
      colName: "stage_name",
      values: ["", ...stages],
    },
  ];

  return { DROPDOWN_COLS: DROPDOWN_COLS as DropdownCols };
};

export type DropdownCols = {
  colName: string;
  values: string[];
}[];
