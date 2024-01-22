"use client";

import { SelectZawhna, SelectUser } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

type ColumnDataType = SelectZawhna & {
  users: SelectUser | null;
};

export const columns: ColumnDef<ColumnDataType>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "content",
    header: "Question",
  },
  {
    accessorFn: (row) => `${row.users?.email}`,
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
