"use client";

import { SearchBox, SearchButton } from "@orama/searchbox";
import "@orama/searchbox/dist/index.css";
import { useEffect, useState } from "react";

const oramaConfig = {
  theme: "secondary",
  resultsMap: {
    path: "id",
    title: "title",
    section: "category",
    description: "description",
  },
  colorScheme: "system",
} as const;

export function OramaSearchBox() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div>
          <SearchButton />
          <SearchBox
            backdrop
            cloudConfig={{
              url: process.env.NEXT_PUBLIC_ORAMA_API_ENDPOINT!,
              key: process.env.NEXT_PUBLIC_ORAMA_PUBLIC_API_KEY!,
            }}
            {...oramaConfig}
          />
        </div>
      )}
    </>
  );
}
