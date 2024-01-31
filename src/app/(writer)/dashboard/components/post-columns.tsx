"use client";

import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { postStatuses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SelectPost } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";
import {
  LucideCopy,
  MoreHorizontal,
  PenSquare,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "./data-table-column-header";

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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const [isClient, setIsClient] = useState(false);

      // To ensure the date is rendered only in the client to prevent hydration warnings
      useEffect(() => {
        setIsClient(true);
      }, []);

      return (
        <span>{isClient && row.original.createdAt?.toLocaleString()}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const obj = row.original;
      const postDelete = api.post.delete.useMutation();
      const [showDeleteAlert, setShowDeleteAlert] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleDeletePost = () => {
        postDelete.mutate(
          { postId: obj.id },
          {
            onSuccess: () => {
              setIsLoading(false);
              setShowDeleteAlert(false);
              router.refresh();
              toast.success("Post Deleted", {
                description: "The post has been deleted successfully.",
              });
            },
            onError: () => {
              setIsLoading(false);
              toast.error("Something went wrong.", {
                description:
                  "Your post could not be deleted. Please try again.",
              });
            },
          },
        );
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(obj.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PenSquare className="mr-3 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideCopy className="mr-3 h-4 w-4" /> Make a copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4 text-destructive" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this post?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this post and remove it's data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    setIsLoading(true);
                    handleDeletePost();
                  }}
                  className={cn(buttonVariants({ variant: "destructive" }))}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
