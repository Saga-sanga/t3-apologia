"use client";

import { DataTableColumnHeader } from "@/app/(writer)/dashboard/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { questionStatuses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SelectUser, SelectZawhna } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "timeago.js";

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
    filterFn: (row, id, value) => {
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
        <div className="flex">
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
      const obj = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(obj.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
