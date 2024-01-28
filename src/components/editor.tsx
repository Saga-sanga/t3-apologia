"use client";

import { cn } from "@/lib/utils";
import { postPatchSchema } from "@/lib/validators";
import { SelectPost } from "@/server/db/schema";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";

interface EditorProps {
  post: Pick<SelectPost, "id" | "title" | "content" | "state">;
}

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({ post }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });
  const router = useRouter();
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    // @ts-expect-error: Type package cannot be found
    const Embed = (await import("@editorjs/embed")).default;
    // @ts-expect-error: Type package cannot be found
    const NestedList = (await import("@editorjs/nested-list")).default;
    // @ts-expect-error: Type package cannot be found
    const LinkTool = (await import("@editorjs/link")).default;
    // @ts-expect-error: Type package cannot be found
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        onChange(api, event) {
          // console.log({ api, event });

          const autoSave = async () => {
            const blocks = await api.saver.save();
            console.log(blocks);
          };

          autoSave();
        },
        placeholder: "Type here to start writing your post...",
        inlineToolbar: true,
        // @ts-expect-error: Json object type is dynamic plus we let the Editor handle it
        data: post.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          nestedList: NestedList,
          embed: Embed,
          imageTool: {
            class: ImageTool,
            config: {
              endpoints: {
                // Add trpc post input endpoint for presignedurl
                byFile: ""
              }
            }
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (errors.title) {
      toast.error("Check your Title", {
        description: errors.title?.message,
      });
    }
  }, [errors.title]);

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

  const onPublish = async (data: FormData) => {
    const blocks = await ref.current?.save();
    console.log({ data, blocks });
  };

  return (
    <form>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard/posts"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm capitalize text-muted-foreground">
              {post.state}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "outline" }))}
              // onClick={handleSubmit(onSave)}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Save</span>
            </button>
            <button
              type="submit"
              className={cn(buttonVariants())}
              onClick={handleSubmit(onPublish)}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Publish</span>
            </button>
          </div>
        </div>
        <div className="prose prose-stone dark:prose-invert mx-auto w-[800px]">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title ?? "Untitled Post"}
            placeholder="Post title"
            {...register("title")}
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor"></div>
        </div>
      </div>
    </form>
  );
}
