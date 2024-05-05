"use client";

import { api } from "@/trpc/react";
import { Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
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
import { Separator } from "./ui/separator";
import { Icons } from "./icons";

type AccountDeleteSectionProps = {
  userId: string;
};

export function AccountDeleteSection({ userId }: AccountDeleteSectionProps) {
  const deleteUser = api.user.delete.useMutation();

  const handleClick = () => {
    deleteUser.mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          signOut({ callbackUrl: "/" });
        },
        onError: () => {
          toast.error("Error deleting account. Please try again!");
        },
      },
    );
  };

  return (
    <div className="flex flex-col space-y-6 rounded-lg border p-8">
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger zone</h3>
        <p className="text-sm text-muted-foreground">
          Fimkhur roh. Account delete hnu ah a dawn let leh thieh toh lo ania.
        </p>
      </div>
      <Separator />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="self-end">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              I MizoApologia.org account hi i delete duh tak tak em?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p>
            I user information leh i zawhna zawh zawng zawng te hi I account nen
            kan database atanga delete vek a ni don.
          </p>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleClick}
              disabled={deleteUser.isLoading}
            >
              {deleteUser.isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
