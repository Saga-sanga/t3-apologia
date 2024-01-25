"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { XCircleIcon } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnFilterName: string;
  facetedFilterColumn?: string;
  facetedFilterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  columnFilterName,
  facetedFilterColumn,
  facetedFilterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${columnFilterName}s...`}
          value={
            (table.getColumn(columnFilterName)?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn(columnFilterName)
              ?.setFilterValue(event.target.value)
          }
          className="h-9 max-w-sm"
        />
        {table.getColumn(facetedFilterColumn!) &&
          facetedFilterOptions && (
            <DataTableFacetedFilter
              column={table.getColumn(facetedFilterColumn!)}
              title={facetedFilterColumn}
              options={facetedFilterOptions}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XCircleIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
