import { SelectZawhna } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CategorySkeleton } from "./category-skeleton";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type QuestionSelectorProps = {
  questionId: string | null;
};

export function QuestionSelector({ questionId }: QuestionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SelectZawhna>();
  const params = usePathname();

  const postId = params.split("/")[2];

  const questions = api.question.getNotDuplicate.useQuery();
  const mutatePost = api.post.update.useMutation();
  const mutateQuestion = api.question.update.useMutation();
  const mutateQuestionAnswerId = api.question.setAnswer.useMutation();

  useEffect(() => {
    if (questions.data && questionId) {
      const question = questions.data.find(
        (question) => question.id === questionId,
      );
      setSelectedQuestion(question);
    }
  }, [questions.data, questionId]);

  //====== Update button message ================
  let buttonMessage = "Select question";

  if (selectedQuestion) {
    buttonMessage = selectedQuestion.content!;
  }
  //=============================================

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleSelect = (question: SelectZawhna) => {
    setSelectedQuestion(question);
    mutatePost.mutate(
      {
        id: postId!,
        questionId: question.id,
      },
      {
        onSuccess: () => {
          // Revert previously selected question's status to unanswered
          if (selectedQuestion) {
            mutateQuestion.mutate({
              id: selectedQuestion?.id,
              status: "unanswered",
            });
          }

          // Update question's answerId after successfully updating post
          mutateQuestionAnswerId.mutate({
            id: questionId!,
            answerId: postId!,
          });
        },
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {!questions.isLoading ? (
          <Button
            variant="outline"
            className="flex h-8 w-full max-w-[450px] justify-between"
          >
            <span className="truncate">{buttonMessage}</span>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <Skeleton className="h-8 w-full" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0">
        <Command className="">
          <CommandInput placeholder="Search question..." />
          <CommandEmpty>No question found.</CommandEmpty>
          <CommandGroup>
            {questions.data ? (
              questions.data.map((question) => (
                <CommandItem
                  key={question.id}
                  onSelect={() => runCommand(() => handleSelect(question))}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      selectedQuestion?.id === question.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span>{question.content}</span>
                </CommandItem>
              ))
            ) : (
              <CategorySkeleton />
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
