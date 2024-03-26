import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const postRouter = createTRPCRouter({
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

  updateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { categoryId, postId } }) => {
      await ctx.db
        .update(posts)
        .set({ categoryId })
        .where(eq(posts.id, postId));
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.record(z.any()).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        questionId: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { title, description, content, image, id, questionId },
      }) => {
        if (title === "") {
          title = "Untitled";
        }
        console.log({ description });

        await ctx.db
          .update(posts)
          .set({ title, description, content, image, questionId })
          .where(eq(posts.id, id));

        revalidatePath("/dashboard/posts");
      },
    ),

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
});
