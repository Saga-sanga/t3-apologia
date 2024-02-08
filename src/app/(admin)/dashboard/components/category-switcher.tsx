"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SelectCategory } from "@/server/db/schema";
import { api } from "@/trpc/react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  MoreHorizontalIcon,
  PlusCircleIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CategorySwitcherProps extends PopoverTriggerProps {
  categoryId: string | null;
}

// Figure out how to best fetch data
export function CategorySwitcher({
  className,
  categoryId,
}: CategorySwitcherProps) {
  const utils = api.useUtils();
  const categoryMutation = api.category.create.useMutation({
    onSuccess: () => utils.category.invalidate(),
  });
  const categories = api.category.get.useQuery();

  const [open, setOpen] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectCategory>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (categories.data) {
      const category = categories.data.find((ele) => ele.id === categoryId);
      console.log({ category });
      setSelectedCategory(category);
    }
  }, [categories.data]);

  const handleSubmitCategory = () => {
    if (name) {
      categoryMutation.mutate(
        { name },
        {
          onSuccess: () => {
            toast.success("Category created", {
              description: "Your new category has been added successfully.",
            });
            setShowCategoryDialog(false);
          },
          onError: () => {
            toast.error("Cannot add category", {
              description:
                "We had trouble adding your category. Please try again.",
            });
          },
        },
      );
    } else {
      toast.error("Please input name", {
        description: "Category name cannot be empty.",
      });
    }
  };

  return (
    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select category"
            className={cn("h-8 w-[200px] justify-between", className)}
          >
            {selectedCategory ? selectedCategory.name : "Select category"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.data ? (
                  categories.data.map((category) => (
                    <CommandItem
                      key={category.id}
                      className="flex justify-between"
                    >
                      <button
                        className="flex w-full items-center"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategory?.id === category.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {category.name}
                      </button>
                      <Button
                        variant="ghost"
                        className="h-5 border border-transparent px-2 hover:border-border"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </CommandItem>
                  ))
                ) : (
                  <div className="space-y-2 py-1">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                  </div>
                )}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowCategoryDialog(true);
                    }}
                  >
                    <PlusCircleIcon className="mr-2 h-5 w-5" /> Create Category
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Add a new category to categorise posts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="name">Category name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Trinity"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowCategoryDialog(false)}
            disabled={categoryMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmitCategory}
            disabled={categoryMutation.isLoading}
          >
            {categoryMutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
