import { CheckIcon } from "lucide-react";
import { CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { CategoryDrowdown } from "./category-dropdown";
import { SelectCategory } from "@/server/db/schema";
import { useState } from "react";
import { Input } from "./ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

type CategoryItemProps = {
  category: SelectCategory;
  selected?: SelectCategory;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          name: string | null;
        }
      | undefined
    >
  >;
};

export function CategoryItem({
  category,
  selected,
  setSelectedCategory,
}: CategoryItemProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(category.name ?? undefined);

  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  const utils = api.useUtils();
  const editCategory = api.category.update.useMutation({
    onError: () =>
      toast.error("Update Error", {
        description: "Cannot update category name. Please try again.",
      }),
    onSettled: () => utils.category.invalidate(),
  });
  const updatePostCategory = api.post.updateCategory.useMutation();

  const handleEdit = () => {
    setEditing(false);
    editCategory.mutate({ name: content as string, id: category.id });
  };

  const handleChange = () => {
    if (postId) {
      setSelectedCategory(category);
      updatePostCategory.mutate({ categoryId: category.id, postId });
    }
  };

  return (
    <CommandItem key={category.id} className="flex justify-between">
      {!editing ? (
        <button className="flex w-full items-center" onClick={handleChange}>
          <CheckIcon
            className={cn(
              "mr-2 h-4 w-4",
              selected?.id === category.id ? "opacity-100" : "opacity-0",
            )}
          />
          {content}
        </button>
      ) : (
        <Input
          className="h-6 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
        />
      )}
      <CategoryDrowdown setEditing={setEditing} categoryId={category.id} />
    </CommandItem>
  );
}
