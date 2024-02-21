"use client";

import { postStatuses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SelectCategory, SelectPost } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DateLocale } from "./date-locale";
import { PostTableRowAction } from "./post-table-row-actions";

export type PostColumnDataType = SelectPost & {
  category: SelectCategory | null;
};

export const postColumns: ColumnDef<PostColumnDataType>[] = [
  {
    accessorKey: "state",
    header: () => <div className="">State</div>,
    cell: ({ row }) => {
      const state = postStatuses.find(
        (status) => status.value === row.getValue("state"),
      );

      if (!state) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <state.icon
            className={cn(
              "mr-2 h-4 w-4",
              state.value === "draft" && "text-muted-foreground",
              state.value === "published" && "text-primary",
            )}
          />
          <span
            className={cn(
              state.value === "draft" && "text-muted-foreground",
              state.value === "published" && "text-primary",
            )}
          >
            {state.label}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">
          <Link
            href={`/editor/${row.original.id}`}
            className="max-w-[700px] truncate font-medium underline-offset-4 hover:underline"
          >
            {row.getValue("title")}
          </Link>
        </div>
      );
    },
  },
  {
    id: "category",
    accessorFn: (column) => column.category?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return <DateLocale date={row.original.createdAt} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const obj = row.original;
      return <PostTableRowAction postId={obj.id} />;
    },
    enableHiding: false,
    enableSorting: false,
  },
];
