import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { replies } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export const replyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        parentId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { parentId, postId, content } = input;
      await ctx.db
        .insert(replies)
        .values({ parentId, content, userId: ctx.session.user.id });
      revalidatePath(`/post/${postId}`);
    }),

  update: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        replyId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, replyId, content } = input;

      await ctx.db
        .update(replies)
        .set({ content })
        .where(
          and(eq(replies.id, replyId), eq(replies.userId, ctx.session.user.id)),
        );
      revalidatePath(`/post/${postId}`);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        replyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(replies)
        .where(
          and(
            eq(replies.id, input.replyId),
            eq(replies.userId, ctx.session.user.id),
          ),
        );
    }),
});
