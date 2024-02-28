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
  UserIcon,
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
  const utils = api.useUtils();
  const router = useRouter();
  const createPost = api.post.create.useMutation();
  const mutateQuestion = api.question.update.useMutation({
    onSuccess: () => {
      utils.question.invalidate();
      router.refresh();
    },
  });

  const handleAnswer = () => {
    const promise = createPost.mutateAsync({
      title: rowData?.content ?? "Untitled Post",
    });

    toast.promise(promise, {
      loading: "Creating...",
      success: (data) => {
        router.push(`editor/${data?.postId}`);
        return "Post has been created.";
      },
      error: "Error creating post",
    });
  };

  const handleSetDuplicate = () => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleAnswer}>
          <ArrowUpRightFromSquare className="mr-3 h-4 w-4" /> Answer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/user/${rowData.userId}`)}
        >
          <UserIcon className="mr-3 h-4 w-4" />
          View user
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetDuplicate}>
          {rowData.status === "unanswered" && (
            <>
              <Layers3Icon className="mr-3 h-4 w-4" /> Mark duplicate
            </>
          )}
          {rowData.status === "duplicate" && (
            <>
              <HelpCircle className="mr-3 h-4 w-4" /> Mark unanswered
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
