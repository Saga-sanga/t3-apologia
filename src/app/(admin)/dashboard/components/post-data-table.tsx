"use client";

import { SelectPost } from "@/server/db/schema";
import { DataTable } from "./data-table";
import { postColumns } from "./post-columns";
import { postStatuses } from "@/lib/data";

type PostDataTableProps = {
  data: SelectPost[];
};

export function PostDataTable({ data }: PostDataTableProps) {
  return (
    <DataTable
      columns={postColumns}
      data={data}
      columnFilterName="title"
      facetedFilterColumn="state"
      facetedFilterOptions={postStatuses}
    />
  );
}
