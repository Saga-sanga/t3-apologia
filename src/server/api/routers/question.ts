import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zawhna } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["unanswered", "duplicate"]),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { id, status, content } }) => {
      await ctx.db
        .update(zawhna)
        .set({ status, content })
        .where(eq(zawhna.id, id));

      revalidatePath("/dashboard");
    }),
});
