"use client";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { Button, ButtonProps } from "./ui/button";

export function PostCreateButton({
  className,
  variant,
  ...props
}: ButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const mutatePost = api.post.create.useMutation();

  const handleClick = async () => {
    setIsLoading(true);

    mutatePost.mutate(
      {
        title: "Untitled Post",
      },
      {
        onSuccess: (data) => {
          // forces cache invalidation
          router.refresh();
          router.push(`/editor/${data?.postId}`);
        },
        onError: (error) => {
          console.log(error.data?.httpStatus);
          toast.error("Something went wrong.", {
            description: "Your post was not created. Please try again.",
          });
        },
      },
    );
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn(
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className,
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="mr-2 h-4 w-4" />
      )}
      New post
    </Button>
  );
}
