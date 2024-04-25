"use client";

import { FlagIcon, MoreHorizontal, SquarePenIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Fragment } from "react";

type CommentOptionsProps = {
  isCurrentUser: boolean;
};

export function CommentOptions({ isCurrentUser }: CommentOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-1.5">
          <MoreHorizontal className="h-4 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <FlagIcon className="mr-2 h-4 w-4" />
            <span>Report</span>
          </DropdownMenuItem>
          {isCurrentUser && (
            <Fragment>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SquarePenIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </Fragment>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
