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
import { cn } from "@/lib/utils";
import { SelectCategory } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CategoryItem } from "./category-item";
import { CategorySkeleton } from "./category-skeleton";
import { Skeleton } from "./ui/skeleton";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CategorySwitcherProps extends PopoverTriggerProps {
  categoryId: string | null;
}

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

  useEffect(
    () => console.log({ switcher: categories.data }),
    [categories.data],
  );

  useEffect(() => {
    if (categories.data) {
      const category = categories.data.find((ele) => ele.id === categoryId);
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

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {categories.isLoading ? (
            <Skeleton className="h-8 w-[200px]" />
          ) : (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select category"
              className={cn(
                "h-8 w-[200px] shrink-0 justify-between",
                className,
              )}
            >
              <span className="truncate">
                {selectedCategory ? selectedCategory.name : "Select category"}
              </span>
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.data ? (
                  categories.data.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      selected={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      runCommand={runCommand}
                    />
                  ))
                ) : (
                  <CategorySkeleton />
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
                    className="cursor-pointer"
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
            disabled={categoryMutation.isLoading || name === ""}
          >
            {categoryMutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
