import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const userRouter = createTRPCRouter({
  checkIfUsernameExists: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, input.username),
      });

      // check if existing username belongs to current user
      if (ctx.session.user.id === user?.id) {
        return false;
      }

      return user ? true : false;
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        sex: z.enum(["male", "female"]),
        dob: z.date(),
        profession: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ ...input, completedOnboarding: true })
        .where(eq(users.id, ctx.session.user.id));

      revalidatePath("/settings");
    }),
});
