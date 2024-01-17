"use client";

import { Dispatch, SetStateAction } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FacebookIcon } from "lucide-react";

type OauthProps = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function OAuthButtons({ isLoading, setIsLoading }: OauthProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn("facebook", { callbackUrl: "/" });
        }}
        disabled={isLoading}
        size="lg"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FacebookIcon className="mr-2 h-4 w-4" />
        )}
        Facebook
      </Button>
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn("google", { callbackUrl: "/" });
        }}
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
