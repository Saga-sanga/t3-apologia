"use client";

import { postStatuses } from "@/lib/data";
import { DataTable } from "../../../../components/data-table/data-table";
import { PostColumnDataType, postColumns } from "./post-columns";
import { SelectCategory } from "@/server/db/schema";
import { capitaliseString } from "@/lib/utils";

type PostDataTableProps = {
  data: PostColumnDataType[];
  categoryList: SelectCategory[];
};

export function PostDataTable({ data, categoryList }: PostDataTableProps) {
  const category = categoryList.map((category) => ({
    label: capitaliseString(category.name) as string,
    value: category.name as string,
  }));

  return (
    <DataTable
      columns={postColumns}
      data={data}
      columnFilterName="title"
      facetedFilterColumns={["state", "category"]}
      facetedFilterOptions={{ state: postStatuses, category }}
    />
  );
}
