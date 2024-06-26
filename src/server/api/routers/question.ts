import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zawhna } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq, ne } from "drizzle-orm";

export const questionRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.zawhna.findMany({
      orderBy: [desc(zawhna.content)],
    });
  }),
  getNotDuplicate: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.zawhna.findMany({
      orderBy: [desc(zawhna.content)],
      where: ne(zawhna.status, "duplicate"),
    });
  }),
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
        status: z.enum(["unanswered", "duplicate"]).optional(),
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
  setAnswer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        answerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id, answerId } }) => {
      await ctx.db
        .update(zawhna)
        .set({ status: "answered", answerId })
        .where(eq(zawhna.id, id));

      revalidatePath("/dashboard");
    }),
  delete: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input: { questionId } }) => {
      await ctx.db.delete(zawhna).where(eq(zawhna.id, questionId));
      revalidatePath("/dashboard");
      revalidatePath("/[username]");
    }),
});
