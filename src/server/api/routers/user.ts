import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { userAgent } from "next/server";

export const userRouter = createTRPCRouter({
  checkIfUsernameExists: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, input.username),
      });

      return await user ? true : false;
    }),
});
