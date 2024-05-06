"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type ReplyDialogType = {
  postId: string;
};

export function ReplyDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="px-0" variant="link">
          Reply
        </Button>
      </AlertDialogTrigger>
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
    </AlertDialog>
  );
}
