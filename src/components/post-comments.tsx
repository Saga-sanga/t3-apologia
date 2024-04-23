"use client";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function PostComments() {
  return (
    <div className="mt-12 border-t">
      <h3 className="pb-3">Comments</h3>
      <div className="flex space-x-2">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full space-y-3">
          <Textarea placeholder="Hetah hian I thil sawi duh te comment rawh le" rows={6} />
          <Button>Submit</Button>
        </div>
      </div>
      {/* Add comment list here */}
    </div>
  );
}
