"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { questionStatuses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SelectUser, SelectZawhna } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { format } from "timeago.js";
import { QuestionTableRowActions } from "./question-table-row-actions";

export type QuestionColumnDataType = SelectZawhna & {
  users: SelectUser | null;
};

export const questionColumns: ColumnDef<QuestionColumnDataType>[] = [
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const status = questionStatuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={cn(
            "flex w-[110px] items-center",
            status.value === "unanswered" && "text-destructive",
            status.value === "answered" && "text-primary",
          )}
        >
          {status.icon && (
            <status.icon
              className={cn(
                "mr-2 h-4 w-4 text-muted-foreground",
                status.value === "unanswered" && "text-destructive",
                status.value === "answered" && "text-primary",
              )}
            />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "question",
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          {/* <span className="h-2 w-2 rounded-full bg-blue-400"></span> */}
          <span className="max-w-[700px] truncate font-medium">
            {row.getValue("question")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="max-w-60 truncate">
        {format(row.getValue("createdAt"))} by{" "}
        <Link className="underline-offset-4 hover:underline" href="/user">
          {row.original.users?.name}
        </Link>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <QuestionTableRowActions rowData={rowData}/>;
    },
    enableHiding: false,
    enableSorting: false,
  },
];
