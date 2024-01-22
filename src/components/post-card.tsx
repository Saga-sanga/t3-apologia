import { MessagesSquareIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function PostCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title of the card</CardTitle>
        <CardDescription className="hidden md:block">
          Description of the card
        </CardDescription>
        <CardContent className="rounded-md p-0 py-4">
          <img
            className="rounded-md"
            src="https://res.cloudinary.com/practicaldev/image/fetch/s--PEV2gWZF--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ivcklrrurjt31814zwio.png"
          />
        </CardContent>
        <CardFooter className="p-0">
          <Link
            href="#"
            className={cn(
              "flex items-center",
            )}
          >
            <MessagesSquareIcon className="mr-2 h-4 w-4" /> Comment
          </Link>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
