"use client";

import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CommentEditor } from "./comment-editor";
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
import { UserAvatar } from "./user-avatar";

type CommentInputProps = {
  user: {
    image: string;
    name: string;
  };
  isAuth: boolean;
};

export function CommentInput({ user, isAuth }: CommentInputProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // const ref = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  useEffect(() => {
    if (window.location.hash === "#comments") {
      setIsEditing(true);
    }
  }, []);

  const handleClick = () => {
    if (!isAuth) {
      setOpen(true);
      return;
    }

    if (postId) {
      setIsEditing(true);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login hmasa rawh!</AlertDialogTitle>
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
        <h3 className="mb-8 mt-14 text-2xl font-semibold text-foreground">
          Comments
        </h3>
        {isEditing ? (
          <CommentEditor postId={postId ?? ""} setIsEditing={setIsEditing} />
        ) : (
          <button
            onClick={handleClick}
            className="not-prose flex w-full items-center space-x-3 rounded-lg border p-4"
          >
            <UserAvatar user={{ name: user.name, image: user.image }} />
            <p className="text-base text-muted-foreground">
              Comment tha tak hetah hian i ziak thei e
            </p>
          </button>
        )}
      </div>
    </AlertDialog>
  );
}
