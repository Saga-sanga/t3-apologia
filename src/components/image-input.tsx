"use client";

import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

interface ImageInputProps {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function ImageInput({ children, onChange, disabled }: ImageInputProps) {
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
        onChange={onChange}
        id="image"
        type="file"
        className="hidden"
        accept="image/*"
      />
    </Label>
  );
}
