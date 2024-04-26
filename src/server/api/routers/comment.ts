import { comments } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, commentId, content } = input;

      await ctx.db
        .update(comments)
        .set({ content })
        .where(
          and(
            eq(comments.id, commentId),
            eq(comments.userId, ctx.session.user.id),
          ),
        );
      revalidatePath(`/post/${postId}`);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(comments)
        .where(
          and(
            eq(comments.id, input.commentId),
            eq(comments.userId, ctx.session.user.id),
          ),
        );

      // throw new TRPCError({ code: "UNAUTHORIZED" });
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
