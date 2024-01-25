"use client";

import { SelectPost } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";

// TODO: Build out column for posts
export const postColumns: ColumnDef<SelectPost>[] = [
  {
    accessorKey: "state",
    header: () => <div className="">State</div>,
  },
];
