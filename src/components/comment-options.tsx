"use client";

import { api } from "@/trpc/react";
import { FlagIcon, MoreHorizontal, SquarePenIcon, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

type CommentOptionsProps = {
  isCurrentUser: boolean;
  commentId: string;
  setIsEditing: (input: boolean) => void;
  variant: "comment" | "reply";
};

export function CommentOptions({
  isCurrentUser,
  commentId,
  setIsEditing,
  variant,
}: CommentOptionsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: () => toast.success("Comment deleted successfully"),
  });

  const deleteReply = api.reply.delete.useMutation({
    onSuccess: () => toast.success("Reply deleted successfully"),
  });

  const handleDelete = () => {
    if (variant === "comment") {
      deleteComment.mutate(
        { commentId },
        {
          onSuccess: () => {
            router.refresh();
            setOpen(false);
            toast.success("Comment deleted successfully");
          },
          onError: () =>
            toast.error("Cannot delete comment. Please try again!"),
        },
      );
    }

    if (variant === "reply") {
      deleteReply.mutate(
        { replyId: commentId },
        {
          onSuccess: () => {
            router.refresh();
            setOpen(false);
            toast.success("Comment deleted successfully");
          },
          onError: () =>
            toast.error("Cannot delete comment. Please try again!"),
        },
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this comment?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            comment from our servers.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteComment.isLoading || deleteReply.isLoading}
            >
              {deleteComment.isLoading || deleteReply.isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 px-1.5">
            <MoreHorizontal className="h-4 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <FlagIcon className="mr-2 h-4 w-4" />
              <span>Report</span>
            </DropdownMenuItem>
            {isCurrentUser && (
              <Fragment>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <SquarePenIcon className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </Fragment>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
