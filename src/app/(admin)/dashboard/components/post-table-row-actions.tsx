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
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  LucideCopy,
  MoreHorizontal,
  PenSquare,
  Trash2Icon,
  ViewIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PostTableRowActionProps extends React.HTMLAttributes<HTMLDivElement> {
  postId: string;
}

export function PostTableRowAction({ postId }: PostTableRowActionProps) {
  const router = useRouter();
  const postDelete = api.post.delete.useMutation();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePost = () => {
    postDelete.mutate(
      { postId },
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
            description: "Your post could not be deleted. Please try again.",
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
          {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(obj.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push(`/post/${postId}`)}>
            <ViewIcon className="mr-3 h-4 w-4" /> View post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/editor/${postId}`)}>
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
              This action cannot be undone. This will permanently delete this
              post and remove it's data from our servers.
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
}
