import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email(),
});

export const postPatchSchema = z.object({
  image: z.string().optional(),
  title: z.string().min(3).max(128).optional(),
  content: z.any().optional(),
});
