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

export interface EditorProps {
  post: Pick<SelectPost, "id" | "title" | "content" | "state" | "image">;
}

//TODO: Implement autosave
export function Editor({ post }: EditorProps) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const postMutation = api.post.update.useMutation();
  const publishMutation = api.post.changeState.useMutation();

  const ref = useRef<EditorJS>();

  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    post.image ?? undefined,
  );
  const [title, setTitle] = useState(post.title);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [debouncedTitle] = useDebounce(title, 750);

  useEffect(() => {
    // console.log({ debouncedTitle, imageUrl });
    const autoSaveTitleAndImage = () => {
      setIsSaving(true);
      console.log(imageUrl);
      postMutation.mutate(
        {
          id: post.id,
          title: debouncedTitle!,
          image: imageUrl,
        },
        {
          onSuccess: () => {
            setIsSaving(false);
            router.refresh();
            // toast.success("Post Saved", {
            //   description: "Your post has been saved successfully",
            // });
          },
          onError: () => {
            setIsSaving(false);
            setSavingError(true);
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

  const initializeEditor = useEditorJS();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, [post]);

  const saveBlocks = (blocks: OutputData) => {
    setIsSaving(true);
    postMutation.mutate(
      {
        id: post.id,
        content: blocks,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          router.refresh();
          // toast.success("Post Saved", {
          //   description: "Your post has been saved successfully",
          // });
        },
        onError: () => {
          setIsSaving(false);
          setSavingError(true);
          toast.error("Can't Save Post", {
            description: "Please check your network status",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (isMounted) {
      initializeEditor(post, ref, saveBlocks);

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
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setIsLoadingImage(true);
      const res = await edgestore.publicFiles.upload({
        file: e.currentTarget.files[0]!,
      });
      setImageUrl(res?.url);
      setIsLoadingImage(false);
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
    }
    setIsRemoving(false);
  };

  const handleChangeCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const onPublishChange = async () => {
    setIsPublishing(true);
    const postState = post.state === "draft" ? "Published" : "Unpublished";
    publishMutation.mutate(
      {
        id: post.id,
        state: post.state === "draft" ? "published" : "draft",
      },
      {
        onSuccess: () => {
          setIsPublishing(false);
          router.refresh();
          toast.success(`Post ${postState}`, {
            description: `Your post has been ${postState} successfully`,
          });
        },
        onError: () => {
          setIsPublishing(false);
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
          {/* <button
            type="submit"
            disabled={isSaving || isPublishing}
            className={cn(buttonVariants({ variant: "outline" }))}
            // onClick={onSave}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button> */}
          {isSaving ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> Saving
            </div>
          ) : savingError ? (
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
            disabled={isPublishing}
            className={cn(buttonVariants())}
            onClick={onPublishChange}
          >
            {isPublishing && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{post.state === "draft" ? "Publish" : "Unpublish"}</span>
          </button>
        </div>
      </div>
      <form className="prose prose-stone dark:prose-invert mx-auto w-[56rem] pt-6">
        <div className="mb-8">
          {!!imageUrl ? (
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
                  variant="secondary"
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
          ) : (
            <>
              {isLoadingImage ? (
                <div className="flex items-center">
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </div>
              ) : (
                <ImageInput onChange={handleUploadCover}>
                  <ImageIcon className="mr-2 h-5 w-5" /> Add Cover
                </ImageInput>
              )}
            </>
          )}
        </div>
        <TextareaAutosize
          autoFocus
          id="title"
          defaultValue={post.title ?? "Untitled Post"}
          placeholder="Post title"
          name="title"
          value={title as string}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
        />
        <div id="editor"></div>
        <p className="text-sm text-gray-500">
          Use{" "}
          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
            Tab
          </kbd>{" "}
          to open the command menu.
        </p>
      </form>
    </div>
  );
}
