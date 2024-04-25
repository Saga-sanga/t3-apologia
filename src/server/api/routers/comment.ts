import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { comments } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, content } = input;
      await ctx.db
        .insert(comments)
        .values({ userId: ctx.session.user.id, content, postId });

      revalidatePath(`/posts/${postId}`);
    }),

  update: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        commentId: z.string(),
        authorId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, commentId, authorId, content } = input;

      // Check if comment belongs to user
      if (ctx.session.user.id === authorId) {
        await ctx.db
          .update(comments)
          .set({ content })
          .where(eq(comments.id, commentId));
        revalidatePath(`/post/${postId}`);

        return;
      }

      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        authorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if comment belongs to user
      if (ctx.session.user.id === input.authorId) {
        return await ctx.db
          .delete(comments)
          .where(eq(comments.id, input.commentId));
      }

      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),

  get: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { postId } }) => {
      return await ctx.db.query.comments.findMany({
        where: eq(comments.postId, postId),
        orderBy: desc(comments.createdAt),
      });
    }),
});
