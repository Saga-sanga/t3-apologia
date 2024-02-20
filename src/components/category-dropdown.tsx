import { api } from "@/trpc/react";
import {
  MoreHorizontalIcon,
  PenSquareIcon,
  Trash2,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
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
  AlertDialogTrigger
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type CategoryDrowdownProps = {
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId: string;
};

export function CategoryDrowdown({
  setEditing,
  categoryId,
}: CategoryDrowdownProps) {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Success", {
        description: "Category deleted successfully",
      });
      utils.category.invalidate();
      setOpen(false);
    },
    onError: () =>
      toast.error("Error", {
        description: "Failed to delete category. Please try again.",
      }),
  });

  const handleDelete = () => {
    deleteCategory.mutate({ id: categoryId });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-5 border border-transparent px-2 hover:border-border"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => setEditing(true)}
              className="cursor-pointer"
            >
              <PenSquareIcon className="mr-3 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            category from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteCategory.isLoading}
            onClick={handleDelete}
          >
            {deleteCategory.isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}{" "}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
