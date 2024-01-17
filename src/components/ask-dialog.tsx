"use client";

import { PencilLineIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

export function AskDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PencilLineIcon className="mr-2 h-4 w-4" /> Zawt Rawh
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>Zawhna Zawt Rawh</DialogHeader>
        <DialogDescription>
          A hnuaiah hian i zawhna zawh duh chu chipchiar takin zawt rawh le
        </DialogDescription>
        <Textarea/>
        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
