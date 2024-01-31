import { useEffect, useState } from "react";

export function DateLocale({ date }: { date: Date | null }) {
  const [isClient, setIsClient] = useState(false);

  // To ensure the date is rendered only in the client to prevent hydration warnings
  useEffect(() => {
    setIsClient(true);
  }, []);

  return <span>{isClient && date?.toLocaleString()}</span>;
}
