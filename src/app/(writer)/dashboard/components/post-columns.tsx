"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectPost } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { postStatuses } from "@/lib/data";
import { cn } from "@/lib/utils";

// TODO: Build out column for posts
export const postColumns: ColumnDef<SelectPost>[] = [
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
          <span className="max-w-[700px] truncate font-medium">
            {row.getValue("title")}
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
    cell: ({ row }) => <span>{row.original.createdAt?.toDateString()}</span>,
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
