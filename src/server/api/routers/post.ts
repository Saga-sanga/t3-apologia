import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { categories, posts } from "@/server/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { createOramaIndex } from "@/scripts/createOramaIndex";

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

        await ctx.db
          .update(posts)
          .set({ title, description, content, image, questionId })
          .where(eq(posts.id, id));

        revalidatePath("/", "layout");
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

  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(8),
        cursor: z.string().nullish(),
        categoryId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input: { limit, cursor, categoryId } }) => {
      const items = cursor
        ? await ctx.db
            .select({
              id: posts.id,
              title: posts.title,
              description: posts.description,
              image: posts.image,
              createdAt: posts.createdAt,
              category: categories,
            })
            .from(posts)
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .where(
              and(
                lt(posts.createdAt, new Date(cursor)),
                eq(posts.state, "published"),
                categoryId ? eq(posts.categoryId, categoryId) : undefined,
              ),
            )
            .orderBy(desc(posts.createdAt))
            .limit(limit)
        : undefined;

      let nextCursor: typeof cursor | undefined = undefined;

      if (items) {
        const nextItem = items[items.length - 1];
        nextCursor = nextItem?.createdAt?.toISOString();
      }

      return {
        items,
        nextCursor,
      };
    }),
});
