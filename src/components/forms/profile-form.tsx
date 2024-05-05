"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { profileFormSchema } from "@/lib/validators";
import { api } from "@/trpc/react";
import { SelectUser } from "@/server/db/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  userData: Pick<
    SelectUser,
    "username" | "name" | "image" | "dob" | "sex" | "profession"
  >;
};

export function ProfileForm({ userData }: ProfileFormProps) {
  const { username, name, dob, sex, profession, image } = userData;

  const [isLoading, setIsLoading] = useState(false);
  const mutateUser = api.user.update.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: username ?? "",
      name: name ?? "",
      dob: dob ?? undefined,
      sex: sex ?? undefined,
      profession: profession ?? "",
      image,
    },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(
    (values: z.infer<typeof profileFormSchema>) => {
      console.log({ values });
      mutateUser.mutate(values, {
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Profile updated successfully");
          router.refresh();
        },
        onError: () => {
          setIsLoading(false);
          toast.error("Profile kan update theilo. Submit nawn leh roh.");
        },
      });
    },
  );

  const handleClick = () => {
    setIsLoading(true);
    onSubmit();
  };

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="mizoapologia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Zirsangzela Khiangte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                      fixedWeeks
                      defaultMonth={field.value}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="I gender thlang roh" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Nurse" {...field} />
                </FormControl>
                <FormDescription>
                  I hnathawh thin e.g. kut hnathawk, pastor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="ml-auto"
          onClick={handleClick}
          type="submit"
          disabled={isLoading || !form.formState.isDirty}
        >
          Update profile{" "}
          {isLoading && <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
