"use client";

import { questionStatuses } from "@/lib/data";
import { DataTable } from "../../../../components/data-table/data-table";
import { QuestionColumnDataType, questionColumns } from "./question-columns";

interface QuestionDataTableProps {
  data: QuestionColumnDataType[];
}

export function QuestionDataTable({ data }: QuestionDataTableProps) {
  return (
    <DataTable
      columns={questionColumns}
      data={data}
      facetedFilterColumns={["status"]}
      facetedFilterOptions={{ status: questionStatuses }}
      columnFilterName="question"
    />
  );
}
