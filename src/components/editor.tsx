"use client";

import { useEditorJS } from "@/hooks/useEditorJS";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { SelectPost } from "@/server/db/schema";
import { api } from "@/trpc/react";
import type EditorJS from "@editorjs/editorjs";
import {
  CloudIcon,
  CloudOffIcon,
  ImageIcon,
  Loader2Icon,
  LoaderIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { EditorNav } from "./editor-nav";
import { Icons } from "./icons";
import { ImageInput } from "./image-input";
import { Button, buttonVariants } from "./ui/button";
import { useDebounce } from "use-debounce";
import { OutputData } from "@editorjs/editorjs";
import { CategorySwitcher } from "@/components/category-switcher";

export interface EditorProps {
  post: Pick<
    SelectPost,
    "id" | "title" | "content" | "state" | "image" | "categoryId"
  >;
}

//TODO: Add category manager
//TODO: replace nestedList with List parser
export function Editor({ post }: EditorProps) {
  const router = useRouter();
  const ref = useRef<EditorJS>();
  const { edgestore } = useEdgeStore();

  const postMutation = api.post.update.useMutation();
  const publishMutation = api.post.changeState.useMutation();

  const [isMounted, setIsMounted] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    post.image ?? undefined,
  );
  const [title, setTitle] = useState(post.title);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [debouncedTitle] = useDebounce(title, 750);

  useEffect(() => {
    console.log({ post });
  }, [post]);

  useEffect(() => {
    const autoSaveTitleAndImage = () => {
      postMutation.mutate(
        {
          id: post.id,
          title: debouncedTitle!,
          image: imageUrl,
        },
        {
          onSuccess: () => {
            router.refresh();
          },
          onError: () => {
            toast.error("Can't Save Post", {
              description:
                "Your post could not be saved. Please check your network status.",
            });
          },
        },
      );
    };
    autoSaveTitleAndImage();
  }, [debouncedTitle, imageUrl]);

  const saveBlocks = (blocks: OutputData) => {
    postMutation.mutate(
      {
        id: post.id,
        content: blocks,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: () => {
          toast.error("Can't Save Post", {
            description: "Please check your network status",
          });
        },
      },
    );
  };

  const initializeEditor = useEditorJS(post, ref, saveBlocks);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, [post]);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  if (!isMounted) {
    return null;
  }

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.currentTarget.files && e.currentTarget.files.length > 0) {
        setIsLoadingImage(true);
        const res = await edgestore.publicFiles.upload({
          file: e.currentTarget.files[0]!,
        });
        setImageUrl(res?.url);
        setIsLoadingImage(false);
      }
    } catch (error) {
      toast.error("Upload error", {
        description: "Failed to upload image. Please try again.",
      });
    }
  };

  const handleRemoveCover = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsRemoving(true);

    try {
      console.log({ imageUrl });
      await edgestore.publicFiles.delete({ url: imageUrl! });
      setImageUrl(undefined);
    } catch (error) {
      console.log(error);
      toast.error("Cannot Remove Image", {
        description: "Please check your network status and try again",
      });
    }
    setIsRemoving(false);
  };

  const handleChangeCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.currentTarget.files && e.currentTarget.files.length > 0) {
        setIsLoadingImage(true);
        const res = await edgestore.publicFiles.upload({
          file: e.currentTarget.files[0]!,
          options: {
            replaceTargetUrl: imageUrl,
          },
        });
        setImageUrl(res?.url);
        setIsLoadingImage(false);
      }
    } catch (error) {
      toast.error("Upload Error", {
        description: "Cannot upload image, please try again.",
      });
      setIsLoadingImage(false);
    }
  };

  const onPublishChange = async () => {
    const postState = post.state === "draft" ? "Published" : "Unpublished";
    publishMutation.mutate(
      {
        id: post.id,
        state: post.state === "draft" ? "published" : "draft",
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success(`Post ${postState}`, {
            description: `Your post has been ${postState} successfully`,
          });
        },
        onError: () => {
          toast.error("Can't Publish Post", {
            description: "Your post could not be published. Please try again",
          });
        },
      },
    );
  };

  return (
    <div className="grid w-full">
      <div className="sticky top-4 flex w-full items-center justify-between">
        <EditorNav state={post.state} />
        <div className="flex items-center gap-4">
          {postMutation.isLoading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> Saving
            </div>
          ) : postMutation.isError ? (
            <div className="flex items-center text-destructive">
              <CloudOffIcon className="mr-2 h-5 w-5" /> Saving failed
            </div>
          ) : (
            <div className="flex items-center text-primary">
              <CloudIcon className="mr-2 h-5 w-5 text-primary" /> Saved
            </div>
          )}
          <div className="h-10 border-l border-border"></div>
          <button
            type="submit"
            disabled={publishMutation.isLoading}
            className={cn(buttonVariants())}
            onClick={onPublishChange}
          >
            {publishMutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{post.state === "draft" ? "Publish" : "Unpublish"}</span>
          </button>
        </div>
      </div>
      <form className="prose prose-stone mx-auto w-[56rem] pt-6 dark:prose-invert">
        <div className="mb-8 flex flex-col space-y-2">
          <div className="flex space-x-2">
            {!imageUrl &&
              (isLoadingImage ? (
                <div className="flex items-center px-4">
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </div>
              ) : (
                <ImageInput onChange={handleUploadCover}>
                  <ImageIcon className="mr-2 h-5 w-5" /> Add Cover
                </ImageInput>
              ))}
            <CategorySwitcher categoryId={post.categoryId} />
          </div>
          {!!imageUrl && (
            <div className="group relative w-full">
              {(isRemoving || isLoadingImage) && (
                <div className="absolute z-10 flex h-full w-full items-center justify-center bg-secondary/70">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                </div>
              )}
              <div className="absolute bottom-4 right-4 hidden space-x-2 group-hover:flex">
                <ImageInput disabled={isRemoving} onChange={handleChangeCover}>
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Change Image
                </ImageInput>
                <Button
                  disabled={isRemoving}
                  onClick={handleRemoveCover}
                  className="h-8"
                  variant="outline"
                >
                  <XIcon className="mr-2 h-5 w-5" /> Remove
                </Button>
              </div>
              <img
                // fill
                className="object-cover"
                src={imageUrl}
                alt="Cover Image"
              />
            </div>
          )}
        </div>
        <TextareaAutosize
          autoFocus
          id="title"
          // defaultValue={post.title ?? "Untitled Post"}
          placeholder="Post title"
          name="title"
          value={title as string}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="mb-5 w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
        />
        <div id="editor"></div>
        <p className="text-sm text-gray-500">
          Press{" "}
          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
            /
          </kbd>{" "}
          to open the command menu.
        </p>
      </form>
    </div>
  );
}
