"use client";
import { Icons } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { CardListSkeletion } from "@/components/skeletons/card-list-skeleton";
import { CardSkeletion } from "@/components/skeletons/card-skeleton";
import { api } from "@/trpc/react";
import { useIntersection } from "@mantine/hooks";
import { Fragment, useEffect } from "react";

type InfinitePostCardListProps = {
  cursor: string | null | undefined;
};

export function InfinitePostCardList({ cursor }: InfinitePostCardListProps) {
  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    api.post.infinitePosts.useInfiniteQuery(
      { limit: 3 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: cursor,
      },
    );

  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry]);

  if (!data?.pages) {
    return null;
  }

  return (
    <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.items?.map((item, j) => {
            if (j === page.items?.length! - 1 && i === data.pages.length - 1) {
              return <PostCard ref={ref} post={item} key={item.id} />;
            }
            return <PostCard post={item} key={item.id} />;
          })}
        </Fragment>
      ))}

      {(isFetchingNextPage || isLoading) && <CardListSkeletion />}
    </>
  );
}
