"use client";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { MoreHorizontal, PenSquare, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

type UserQuestionOptionsProps = {
  questionId: string;
  content: string;
};

type DeleteAlertDialogProps = Pick<UserQuestionOptionsProps, "questionId"> & {
  showDeleteAlert: boolean;
  setShowDeleteAlert: (x: boolean) => void;
};

type QuestionEditDialogProps = UserQuestionOptionsProps & {
  showEditDialog: boolean;
  setShowEditDialog: (x: boolean) => void;
};

export function UserQuestionOptions({
  questionId,
  content,
}: UserQuestionOptionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 shrink-0 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <PenSquare className="mr-3 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <QuestionEditDialog
        questionId={questionId}
        content={content}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
      />
      <DeleteAlertDialog
        questionId={questionId}
        showDeleteAlert={showDeleteAlert}
        setShowDeleteAlert={setShowDeleteAlert}
      />
    </>
  );
}

function QuestionEditDialog({
  questionId,
  content,
  showEditDialog,
  setShowEditDialog,
}: QuestionEditDialogProps) {
  const [question, setQuestion] = useState(content);
  const router = useRouter();
  const questionMutate = api.question.update.useMutation();

  const handleSubmit = () => {
    questionMutate.mutate(
      {
        id: questionId,
        content: question,
      },
      {
        onSuccess: () => {
          router.refresh();
          setShowEditDialog(false);
        },
        onError: () => {
          toast.error("Cannot update question", {
            description: "Please check your connection and try again",
          });
        },
      },
    );
  };
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Zawhna Edit Rawh</DialogTitle>
          <DialogDescription>
            A hnuaiah hian I zawhna hi I duh angin siam tha rawh le.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            name="question"
          />
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={questionMutate.isLoading}>
              {questionMutate.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAlertDialog({
  questionId,
  showDeleteAlert,
  setShowDeleteAlert,
}: DeleteAlertDialogProps) {
  const router = useRouter();
  const questionDelete = api.question.delete.useMutation({
    onSuccess: () => router.refresh(),
  });

  const handleDelete = () => {
    questionDelete.mutate(
      { questionId },
      {
        onSuccess: () => {
          setShowDeleteAlert(false);
          router.refresh();
          toast.success("Question Deleted", {
            description: "Your question has been deleted successfully.",
          });
        },
        onError: () => {
          toast.error("Something went wrong.", {
            description:
              "Your question could not be deleted. Please try again.",
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this question?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            question and remove all it's related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={questionDelete.isLoading}
          >
            {questionDelete.isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2Icon className="mr-2 h-4 w-4" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
