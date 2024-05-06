"use client";

import { SelectUser } from "@/server/db/schema";
import { LogOutIcon, UserRoundCogIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";

interface UserAccountNavProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: Pick<SelectUser, "name" | "email" | "image" | "username">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <UserAvatar
          user={{ name: user.name ?? null, image: user.image ?? null }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={`/${user.username}`}
            className="flex cursor-pointer items-center justify-start gap-2 p-2"
          >
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="truncate font-medium">{user.name}</p>}
              {user.username && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/settings">
            <UserRoundCogIcon className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500"
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}`,
            });
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4 stroke-red-500" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
