"use client";

import { postStatuses } from "@/lib/data";
import { DataTable } from "./data-table";
import { PostColumnDataType, postColumns } from "./post-columns";

type PostDataTableProps = {
  data: PostColumnDataType[];
};

export function PostDataTable({ data }: PostDataTableProps) {
  return (
    <DataTable
      columns={postColumns}
      data={data}
      columnFilterName="title"
      facetedFilterColumns={["state"]}
      facetedFilterOptions={{ state: postStatuses }}
    />
  );
}
