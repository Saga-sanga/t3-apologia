import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { SelectCategory, SelectPost } from "@/server/db/schema";

type PostCardProps = {
  post: SelectPost & {
    category: SelectCategory | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <Link
        href={`/post/${post.id}`}
        className="flex justify-between gap-3 p-6 sm:gap-4 md:gap-6"
      >
        <CardHeader className="p-0">
          <CardTitle className="break-words text-xl font-bold">
            {post.title}
          </CardTitle>
          <CardDescription className="hidden  md:block">
            <span className="line-clamp-3 break-words text-base">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum
              exercitationem aspernatur at est, architecto vero molestiae
              repellendus pariatur, quibusdam facilis earum accusantium deleniti
              ab distinctio praesentium tenetur commodi dolor doloribus?
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-md p-0 md:h-[108px] md:shrink-0 md:basis-[180px]">
          <img
            className="h-full rounded-md object-cover"
            src={post.image ?? undefined}
          />
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-sm">
          <Link href="#" className={cn("group flex items-center")}>
            <MessageCircle className="mr-2 h-4 w-4" />{" "}
            <span className="underline-offset-2 group-hover:underline">
              Comment
            </span>
          </Link>
          <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
          <p>35 likes</p>
          <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
          <p>112 reads</p>
        </div>
        <Badge variant="secondary">{post.category?.name}</Badge>
      </CardFooter>
    </Card>
  );
}
