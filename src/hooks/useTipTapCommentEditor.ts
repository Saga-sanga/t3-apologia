import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export function useTipTapCommentEditor(defaultValue: string) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "text-base bg-accent/80 rounded-sm p-2 focus:outline-none",
      },
    },
  });

  return editor;
}
