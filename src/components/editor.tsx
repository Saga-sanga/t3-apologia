"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { SelectPost } from "@/server/db/schema";

interface EditorProps {
  post: Pick<SelectPost, "id" | "title" | "content" | "state">;
}

export function Editor({ post }: EditorProps) {
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
        placeholder: "Type here to start writing your post...",
        inlineToolbar: true,
        data: post.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          nestedList: NestedList,
          embed: Embed,
          imageTool: ImageTool,
        },
      });
    }
  }, []);

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

  return <div id="editor"></div>;
}
