import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import {
  ArrowUpRightFromSquare,
  HelpCircle,
  Layers3Icon,
  MoreHorizontal,
  Trash2Icon,
  UserIcon,
  ViewIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuestionColumnDataType } from "./question-columns";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

interface QuestionTableRowActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rowData: QuestionColumnDataType;
}

export function QuestionTableRowActions({
  rowData,
}: QuestionTableRowActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createPost = api.post.create.useMutation();
  const mutateQuestion = api.question.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const setAnswer = api.question.setAnswer.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleAnswer = () => {
    const promise = createPost.mutateAsync({
      title: rowData?.content ?? "Untitled Post",
    });

    toast.promise(promise, {
      loading: "Creating...",
      success: async (data) => {
        if (data) {
          setAnswer.mutate({
            id: rowData.id,
            answerId: data?.postId,
          });
          router.push(`editor/${data?.postId}`);
          return "Post has been created.";
        }
        return "Data not returned";
      },
      error: "Error creating post",
    });
  };

  const toggleStatus = () => {
    mutateQuestion.mutate({
      id: rowData.id,
      status:
        rowData.status === "unanswered"
          ? "duplicate"
          : rowData.status === "duplicate"
            ? "unanswered" : "unanswered",
    });
  };

  const handleDelete = () => {
    deleteQuestion.mutate(
      { questionId: rowData.id },
      {
        onSuccess: () => {
          setShowDeleteAlert(false);
          router.refresh();
          toast.success("Question deleted successfully");
        },
        onError: () => {
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
          {rowData.status === "unanswered" && (
            <>
              <DropdownMenuItem onClick={handleAnswer}>
                <ArrowUpRightFromSquare className="mr-2 h-4 w-4" /> Answer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {rowData.status === "answered" && rowData.answerId && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/editor/${rowData.answerId}`)}
              >
                <ViewIcon className="mr-2 h-4 w-4" /> View answer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/user/${rowData.userId}`)}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            View user
          </DropdownMenuItem>
          {rowData.status !== "answered" && (
            <DropdownMenuItem onClick={toggleStatus}>
              {rowData.status === "unanswered" && (
                <>
                  <Layers3Icon className="mr-2 h-4 w-4" /> Mark duplicate
                </>
              )}
              {rowData.status === "duplicate" && (
                <>
                  <HelpCircle className="mr-2 h-4 w-4" /> Mark unanswered
                </>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this question?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deleting user questions is not recommended as they can no longer
              keep track of their questions. This action cannot be undone!
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
              disabled={deleteQuestion.isLoading}
            >
              {deleteQuestion.isLoading ? (
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
