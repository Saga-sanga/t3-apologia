import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SelectUser } from "@/server/db/schema";
import { UserRound } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<SelectUser, "image" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage alt="User Image" src={user.image ?? undefined} />
      <AvatarFallback>
        <span className="sr-only">{user.name}</span>
        <UserRound className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
