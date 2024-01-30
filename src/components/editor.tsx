"use client";

import { cn } from "@/lib/utils";
import { postPatchSchema } from "@/lib/validators";
import { SelectPost } from "@/server/db/schema";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ImageIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { ImageInput } from "./image-input";
import { EditorNav } from "./editor-nav";
import { useEdgeStore } from "@/lib/edgestore";

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
  const { edgestore } = useEdgeStore();

  const ref = useRef<EditorJS>();

  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [contentImageUrls, setContentImageUrls] = useState<string[]>([]);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    // @ts-expect-error: Type package cannot be found
    const Embed = (await import("@editorjs/embed")).default;
    // @ts-expect-error: Type package cannot be found
    const NestedList = (await import("@editorjs/nested-list")).default;
    // @ts-expect-error: Type package cannot be found
    const ImageTool = (await import("@editorjs/image")).default;
    // @ts-expect-error: Type package cannot be found
    const Quote = (await import("@editorjs/quote")).default;
    // @ts-expect-error: Type package cannot be found
    const Delimiter = (await import("@editorjs/delimiter")).default;
    // @ts-expect-error: Type package cannot be found
    const Table = (await import("@editorjs/table")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        async onChange(api, event) {
          const blocks = await api.saver.save();
          console.log(blocks);
        },
        placeholder: "Type here to start writing your post...",
        inlineToolbar: true,
        // @ts-expect-error: Json object type is dynamic plus we let the Editor handle it
        data: post.content,
        tools: {
          header: Header,
          nestedList: NestedList,
          delimiter: Delimiter,
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            // shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          embed: Embed,
          imageTool: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const res = await edgestore.publicFiles.upload({
                      file,
                      options: {
                        temporary: true,
                      },
                    });

                    setContentImageUrls((prevState) => [...prevState, res.url]);

                    return {
                      success: 1,
                      file: {
                        url: res.url,
                      },
                    };
                  } catch (error) {
                    console.log(error);
                    return {
                      success: 0,
                    };
                  }
                },
                async uploadByUrl(url: string) {
                  console.log({ url });
                },
              },
            },
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
    async function uploadToEdgeStore() {
      if (image) {
        // upload image to edgestore
        setIsLoadingImage(true);
        const res = await edgestore.publicFiles.upload({
          file: image,
        });
        setImageUrl(res.url);
        setIsLoadingImage(false);
      }
    }

    uploadToEdgeStore();
  }, [image]);

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
      <div className="grid w-full">
        <div className="flex w-full items-center justify-between">
          <EditorNav state={post.state} />
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
        <div className="prose prose-stone dark:prose-invert mx-auto w-[56rem] pt-6">
          <div className="mb-8">
            {!!imageUrl ? (
              <div className="group relative w-full">
                <div className="absolute bottom-4 right-4 hidden space-x-2 group-hover:flex">
                  <ImageInput disabled={isRemoving} setImage={setImage}>
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Change Image
                  </ImageInput>
                  <Button
                    disabled={isRemoving}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRemoving(true);

                      edgestore.publicFiles
                        .delete({ url: imageUrl })
                        .then(() => {
                          setIsRemoving(false);
                          setImageUrl(undefined);
                        })
                        .catch((err) => {
                          console.log(err);
                          setIsRemoving(false);
                        });
                    }}
                    className="h-8"
                    variant="secondary"
                  >
                    {isRemoving ? (
                      <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <XIcon className="mr-2 h-5 w-5" />
                    )}{" "}
                    Remove
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
                  <ImageInput setImage={setImage}>
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
            {...register("title")}
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor"></div>
        </div>
      </div>
    </form>
  );
}
