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
      }),
    )
    .mutation(async ({ ctx, input: { title } }) => {
      const [data] = await ctx.db
        .insert(posts)
        .values({ title, authorId: ctx.session.user.id })
        .returning({ postId: posts.id });
      return data;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.record(z.any()).optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { title, content, image, id } }) => {
      if (title === "") {
        title = "Untitled";
      }

      await ctx.db
        .update(posts)
        .set({ title, content, image: image ?? null })
        .where(eq(posts.id, id));
    }),

  changeState: protectedProcedure
    .input(z.object({ id: z.string(), state: z.enum(["published", "draft"]) }))
    .mutation(async ({ ctx, input: { state, id } }) => {
      await ctx.db.update(posts).set({ state }).where(eq(posts.id, id));
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
