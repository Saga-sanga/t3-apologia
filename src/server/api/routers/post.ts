import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { title, content, image } }) => {
      const [data] = await ctx.db
        .insert(posts)
        .values({ title, content, image, authorId: ctx.session.user.id })
        .returning({ postId: posts.id });
      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input: { postId } }) => {
      await ctx.db.delete(posts).where(eq(posts.id, postId));
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
