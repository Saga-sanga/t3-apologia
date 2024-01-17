"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import OAuthButtons from "./oauth-buttons";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Icons } from "./icons";
import { formSchema } from "@/lib/validators";

type Schema = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: Schema) {
    setIsLoading(true);

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: "/",
    });

    setIsLoading(false);

    if (signInResult?.error) {
      return toast.error("Cannot send mail", {
        description:
          "Your sign in request failed. Please try using Facebook or Google.",
      });
    }

    if (!signInResult?.ok) {
      return toast.error("Something went wrong", {
        description: "Your sign in request failed. Please try again.",
      });
    }

    return toast.success("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  return (
    <div className="flex sm:w-80 flex-col space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input className="peer h-10" {...field} required />
                </FormControl>
                <FormLabel className="duration-50 absolute top-0 translate-x-3 translate-y-1 cursor-text bg-background px-1 font-normal text-muted-foreground transition ease-out peer-valid:-translate-y-4 peer-valid:scale-90 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:text-primary">
                  Email
                </FormLabel>
                {/* <FormDescription>Enter your email to login</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <OAuthButtons isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}
