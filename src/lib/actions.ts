"use server";

import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { zawhna } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string(),
});

export async function createQuestion(formData: FormData) {
  const user = await getCurrentUser();

  if (user) {
    const rawFormData = Object.fromEntries(formData.entries());
    const { question } = QuestionSchema.parse(rawFormData);

    console.log({ question, user });

    await db
      .insert(zawhna)
      .values({ userId: user.id, content: question, status: "unanswered" });

    revalidatePath("/");
    redirect("/questions");
  }
}
