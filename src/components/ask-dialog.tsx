"use client";

import { api } from "@/trpc/react";
import { PencilLineIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

export function AskDialog() {
  const [open, setOpen] = useState(false);

  const ask = api.question.create.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawFormData = Object.fromEntries(formData.entries());

    ask.mutate(
      { question: rawFormData.question as string },
      {
        onSuccess: () => {
          toast.success("Success!", {
            description: "I zawhna chu tluang takin submit ani e!",
          });
          setOpen(false);
        },
        onError: () => {
          toast.error("Error!", {
            description: "Failed to submit question. Please try again!",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2.5 md:px-4 rounded-full">
          <PencilLineIcon className="md:mr-2 h-5 w-5" />
          <span className="hidden md:block">Zawt Rawh</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Zawhna Zawt Rawh</DialogTitle>
          <DialogDescription>
            A hnuaiah hian i zawhna zawh duh chu chipchiar takin zawt rawh le
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea rows={5} name="question" />
          <DialogFooter>
            <Button disabled={ask.isLoading}>
              {ask.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
