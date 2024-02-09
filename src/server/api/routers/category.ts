import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { name, id } }) => {
      await ctx.db
        .update(categories)
        .set({ name })
        .where(eq(categories.id, id));
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { name } }) => {
      await ctx.db.insert(categories).values({ name });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(categories).where(eq(categories.id, id));
    }),
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(categories).orderBy(categories.name);
  }),
});
