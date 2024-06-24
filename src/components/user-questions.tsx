import { db } from "@/server/db";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { UserQuestionOptions } from "./user-question-options";

type UserQuestionsProps = {
  userId: string;
};

export async function UserQuestions({ userId }: UserQuestionsProps) {
  const questions = await db.query.zawhna.findMany({
    where: (zawhna, { eq }) => eq(zawhna.userId, userId),
    orderBy: (zawhna, { desc }) => desc(zawhna.createdAt),
  });

  return (
    <section className="rounded-lg border px-10 py-5">
      <h3 className="text-xl font-bold">Recent Questions</h3>
      <div className="mt-4 divide-y">
        {questions.length &&
          questions.map((question) => (
            <div className="space-y-1 py-4" key={question.id}>
              <div className="flex space-x-8">
                <span className="flex items-center text-xs text-muted-foreground">
                  {format(question?.createdAt ?? "", "MMM dd, yyyy")}
                </span>
                <Badge
                  variant={
                    question.status === "answered" ? "default" : "outline"
                  }
                >
                  {question.status}
                </Badge>
              </div>
              <div className="flex justify-between space-x-4">
                <p>{question.content}</p>
                <UserQuestionOptions
                  questionId={question.id}
                  content={question.content ?? ""}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
