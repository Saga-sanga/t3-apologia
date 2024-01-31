import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email(),
});

export const postPatchSchema = z.object({
  title: z.string().max(128),
  content: z.any().optional(),
});
