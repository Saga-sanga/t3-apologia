import { Button } from "@/components/ui/button";
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

interface QuestionTableRowActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rowData: QuestionColumnDataType;
}

export function QuestionTableRowActions({
  rowData,
}: QuestionTableRowActionsProps) {
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
        setAnswer.mutate({
          id: rowData.id,
          answerId: data?.postId!,
        });
        router.push(`editor/${data?.postId}`);
        return "Post has been created.";
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
            ? "unanswered"
            : "unanswered",
    });
  };

  const handleDelete = () => {
    const promise = deleteQuestion.mutateAsync({ questionId: rowData.id });

    toast.promise(promise, {
      loading: "Deleting...",
      success: (data) => {
        return "Question deleted";
      },
      error: "Cannot delete question",
    });
  };

  return (
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
          onClick={() => deleteQuestion.mutate({ questionId: rowData.id })}
        >
          <Trash2Icon className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
