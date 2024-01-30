"use client";

import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

interface ImageInputProps {
  children: React.ReactNode;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  disabled?: boolean;
}

export function ImageInput({ children, setImage, disabled }: ImageInputProps) {
  return (
    <Label htmlFor="image">
      <div
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "h-8 cursor-pointer",
          {
            "pointer-events-none opacity-50": disabled,
          },
        )}
      >
        {children}
      </div>
      <Input
        disabled={disabled}
        onChange={(e) => {
          if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            setImage(e.currentTarget.files[0]);
          }
        }}
        id="image"
        type="file"
        className="hidden"
        accept="image/*"
      />
    </Label>
  );
}
