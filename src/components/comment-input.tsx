"use client";

import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { UserAvatar } from "./user-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type CommentInputProps = {
  user: {
    image: string;
    name: string;
  };
  isAuth: boolean;
};

// TODO: add dialog to prompt login if user is not logged in
export function CommentInput({ user, isAuth }: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  useEffect(() => {
    if (window.location.hash === "#comments" && ref.current) {
      ref.current.focus();
    }
  }, []);

  const commentMutation = api.comment.create.useMutation({
    onSuccess: () => {
      setComment("");
      router.refresh();
      toast.success("Comment created successfully");
    },
    onError: () =>
      toast.error("Cannot create comment", {
        description: "Please check your network and try again.",
      }),
  });

  const handleCreate = () => {
    console.log({ isAuth });
    if (!isAuth) {
      setOpen(true);
      return;
    }

    if (postId) {
      commentMutation.mutate({
        postId,
        content: comment,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please Login first!</AlertDialogTitle>
          <AlertDialogDescription>
            Comment siam tur chuan i login phawt a ngai. A hnuaia button hmang
            hian i login thei e.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                router.push(
                  `/login?redirect=${encodeURIComponent(
                    `/post/${postId}#comments`,
                  )}`,
                )
              }
            >
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
      <div className="not-prose mt-20 border-t" id="comments">
        <h3 className="mb-10 mt-14 text-2xl font-semibold text-foreground">
          Comments
        </h3>
        <div className="flex space-x-2">
          <UserAvatar user={{ name: user.name, image: user.image }} />
          <div className="w-full space-y-3">
            <Textarea
              className="resize-none"
              ref={ref}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              placeholder="Hetah hian I thil sawi duh te comment rawh le"
              rows={6}
            />
            <Button
              onClick={handleCreate}
              disabled={commentMutation.isLoading || !comment}
            >
              {commentMutation.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </AlertDialog>
  );
}