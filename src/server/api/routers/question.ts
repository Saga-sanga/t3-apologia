import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zawhna } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export const questionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input: { question } }) => {
      await ctx.db.insert(zawhna).values({
        userId: ctx.session.user.id,
        content: question,
        status: "unanswered",
      });

      revalidatePath("/dashboard");
    }),
});
