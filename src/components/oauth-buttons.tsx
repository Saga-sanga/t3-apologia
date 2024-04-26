"use client";

import { Dispatch, SetStateAction } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Facebook } from "lucide-react";
import { useSearchParams } from "next/navigation";

type OauthProps = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function OAuthButtons({ isLoading, setIsLoading }: OauthProps) {
  const searchParams = useSearchParams();
  console.log({ searchParams: searchParams.get("redirect") });

  function handleOAuth(provider: "facebook" | "google") {
    setIsLoading(true);
    signIn(provider, {
      redirect: false,
      callbackUrl: searchParams?.get("redirect") || "/",
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => handleOAuth("facebook")}
        disabled={isLoading}
        size="lg"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Facebook className="mr-2 h-4 w-4" />
        )}
        Facebook
      </Button>
      <Button
        onClick={() => handleOAuth("google")}
        disabled={isLoading}
        size="lg"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
