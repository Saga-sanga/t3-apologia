import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { questionRouter } from "./routers/question";
import { categoryRouter } from "./routers/category";
import { userRouter } from "./routers/user";
import { commentRouter } from "./routers/comment";
import { replyRouter } from "./routers/replies";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  question: questionRouter,
  category: categoryRouter,
  user: userRouter,
  comment: commentRouter,
  reply: replyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
