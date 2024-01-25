"use client";

import { questionStatuses } from "@/lib/data";
import { DataTable } from "./data-table";
import { QuestionColumnDataType, questionColumns } from "./question-columns";

interface QuestionDataTableProps {
  data: QuestionColumnDataType[];
}

export function QuestionDataTable({ data }: QuestionDataTableProps) {
  return (
    <DataTable
      columns={questionColumns}
      data={data}
      facetedFilterColumn="status"
      facetedFilterOptions={questionStatuses}
      columnFilterName="question"
    />
  );
}
