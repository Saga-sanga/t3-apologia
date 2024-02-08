import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { categories } from "@/server/db/schema";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { name } }) => {
      await ctx.db.insert(categories).values({ name });
    }),
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany();
  }),
});
