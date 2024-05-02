"use client";

import { useTipTapCommentEditor } from "@/hooks/useTipTapCommentEditor";
import { api } from "@/trpc/react";
import { EditorContent } from "@tiptap/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { Button } from "./ui/button";

type CommentEditProps = {
  parentId: string;
  reply?: {
    id: string;
    content: string | null;
  };
  setIsEditing: (input: boolean) => void;
};

export function ReplyEditor({
  parentId,
  reply,
  setIsEditing,
}: CommentEditProps) {
  const edit = !!reply;
  const editor = useTipTapCommentEditor(reply?.content ?? "");

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  const editReply = api.reply.update.useMutation();
  const createReply = api.reply.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsEditing(false);
      toast.success("Reply created successfully");
    },
    onError: () =>
      toast.error("Cannot create reply", {
        description: "Please check your network and try again.",
      }),
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  const handleEdit = () => {
    console.log("editor content", editor?.getHTML());
    editReply.mutate(
      {
        postId: postId ?? "",
        replyId: reply?.id ?? "",
        content: editor?.getHTML() ?? "",
      },
      {
        onSuccess: () => {
          router.refresh();
          setIsEditing(false);
        },
        onError: (error) => {
          console.log({ error });
          toast.error("Failed to update comment. Please try again!");
        },
      },
    );
  };

  const handleCreate = () => {
    createReply.mutate({
      postId: postId ?? "",
      parentId,
      content: editor?.getHTML() ?? "",
    });
  };

  return (
    <div className="w-full space-y-2 rounded-lg border p-4">
      <span className="text-sm text-muted-foreground">Markdown supported</span>
      <EditorContent editor={editor} />
      <div className="flex justify-end space-x-2">
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        {edit ? (
          <Button size="sm" disabled={editReply.isLoading} onClick={handleEdit}>
            {editReply.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={createReply.isLoading}
            onClick={handleCreate}
          >
            {createReply.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Comment
          </Button>
        )}
      </div>
    </div>
  );
}
