import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { comments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

  get: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { postId } }) => {
      return await ctx.db.query.comments.findMany({
        where: eq(comments.postId, postId),
      });
    }),
});
