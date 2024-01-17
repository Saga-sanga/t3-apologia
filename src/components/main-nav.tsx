import { PencilLineIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AskDialog } from "./ask-dialog";

export function MainNav() {
  return (
    <div className="container flex h-16 items-center justify-between py-4">
      <p>Mizo Apologia</p>
      <div className="flex items-center justify-center space-x-8">
        <AskDialog/> 
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
