import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpRightFromSquare, MoreHorizontal } from "lucide-react";
import { QuestionColumnDataType } from "./question-columns";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface QuestionTableRowActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rowData: QuestionColumnDataType;
}

export function QuestionTableRowActions({
  rowData,
}: QuestionTableRowActionsProps) {
  const router = useRouter();
  const createPost = api.post.create.useMutation();

  const handleAnswer = () => {
    console.log({ rowData });
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
        <DropdownMenuItem onClick={handleAnswer}>
          <ArrowUpRightFromSquare className="mr-3 h-4 w-4" /> Answer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View user</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
