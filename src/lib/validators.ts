import { z } from "zod";

type UserNameResponse = {
  result: { data: { json: boolean } };
};

export const formSchema = z.object({
  email: z.string().email(),
});

export const postPatchSchema = z.object({
  title: z.string().max(128),
  content: z.any().optional(),
});

export const welcomeFormSchema = z.object({
  username: z
    .string({
      required_error: "Khawngaihin i username dah roh",
    })
    .min(5, {
      message: "I username a tawi lutuk",
    })
    .max(50, {
      message: "I username a sei lutuk",
    })
    .trim()
    .refine(
      async (username) => {
        const res = await fetch(
          `/api/trpc/user.checkIfUsernameExists?input=${encodeURIComponent(
            JSON.stringify({ json: { username: username } }),
          )}`,
        );
        const { result } = (await res.json()) as UserNameResponse;
        return !result?.data.json;
      },
      {
        message: "Username hman ani toh. A dang thlang roh",
      },
    ),
  name: z
    .string({
      required_error: "Khawngaihin i hming dah roh",
    })
    .min(5, {
      message: "I hming dah a tawi lutuk",
    })
    .max(50, {
      message: "I hming dah a sei lutuk",
    })
    .trim(),
  sex: z.enum(["male", "female"], {
    required_error: "Khawngaihin i gender thlang roh",
  }),
  dob: z.date({
    required_error: "Khawngaihin i date of birth dah roh",
  }),
  profession: z.string().max(50).trim().optional(),
});
