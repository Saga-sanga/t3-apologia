import { checkIfDayPast, cn } from "@/lib/utils";
import { SelectCategory, SelectPost } from "@/server/db/schema";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { format } from "timeago.js";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type PostCardProps = {
  post: Pick<
    SelectPost,
    "id" | "title" | "description" | "image" | "createdAt"
  > & {
    category: SelectCategory | null;
  };
};

// TODO: update post schema to include description and auto populate it

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  function PostCard({ post }, ref) {
    let date;
    if (post.createdAt) {
      date = checkIfDayPast(post.createdAt)
        ? post.createdAt?.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : format(post.createdAt);
    }

    return (
      <Card ref={ref}>
        <Link href={`/post/${post.id}`} className="flex flex-col space-y-3 p-6">
          <div className="text-sm text-muted-foreground">{date && date}</div>
          <div className="flex justify-between gap-3 sm:gap-4 md:gap-6">
            <CardHeader className="p-0">
              <CardTitle className="break-words text-xl font-bold">
                {post.title}
              </CardTitle>
              <CardDescription className="hidden  md:block">
                <span className="line-clamp-3 break-words text-base">
                  {post.description}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="rounded-md p-0 md:h-[108px] md:shrink-0 md:basis-[180px]">
              <Image
                alt="preview image"
                width={180}
                height={108}
                className="h-full w-full rounded-md object-cover"
                src={post.image ?? ""}
              />
            </CardContent>
          </div>
        </Link>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2 text-sm">
            <Link href="#" className={cn("group flex items-center")}>
              <MessageCircle className="mr-1.5 h-4 w-4" />{" "}
              <span className="underline-offset-2 group-hover:underline">
                Comment
              </span>
            </Link>
            <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
            <p>35 likes</p>
            <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
            <p>112 reads</p>
          </div>
          <Link href={`/category/${post.category?.id}`} className="cursor-pointer">
            <Badge variant="secondary" className="hover:border-primary">{post.category?.name}</Badge>
          </Link>
        </CardFooter>
      </Card>
    );
  },
);
