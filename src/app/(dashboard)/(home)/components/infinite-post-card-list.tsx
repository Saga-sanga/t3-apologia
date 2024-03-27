"use client";
import { Icons } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { SelectCategory, SelectPost } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Divide } from "lucide-react";
import { Fragment } from "react";

type PostData = Pick<
  SelectPost,
  "id" | "title" | "description" | "image" | "createdAt"
> & {
  category: SelectCategory | null;
};

type InfinitePostCardListProps = {
  // postsData: PostData[];
  cursor: string | null | undefined;
};

export function InfinitePostCardList({
  // postsData,
  cursor,
}: InfinitePostCardListProps) {
  const { data, fetchNextPage, isFetchingNextPage } =
    api.post.infinitePosts.useInfiniteQuery(
      { limit: 2 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: cursor,
      },
    );

  console.log({ posts: data });

  return (
    <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.items?.map((item) => <PostCard post={item} key={item.id} />)}
        </Fragment>
      ))}

      <Button
        variant="outline"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <>
            Loading <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : data?.pages[data?.pages.length - 1]?.nextCursor ? (
          "Load more..."
        ) : (
          "Nothing more to load"
        )}
      </Button>
    </>
  );
}
