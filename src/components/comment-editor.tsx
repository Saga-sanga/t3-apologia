"use client";

import { useTipTapCommentEditor } from "@/hooks/useTipTapCommentEditor";
import { api } from "@/trpc/react";
import { EditorContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { Button } from "./ui/button";

type CommentEditProps = {
  postId: string;
  comment?: {
    id: string;
    content: string | null;
  };
  setIsEditing: (input: boolean) => void;
};

export function CommentEditor({
  postId,
  comment,
  setIsEditing,
}: CommentEditProps) {
  const edit = !!comment;
  const editor = useTipTapCommentEditor(comment?.content ?? "");

  const editComment = api.comment.update.useMutation();
  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsEditing(false);
      toast.success("Comment created successfully");
    },
    onError: () =>
      toast.error("Cannot create comment", {
        description: "Please check your network and try again.",
      }),
  });
  const router = useRouter();

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  const handleEdit = () => {
    console.log("editor content", editor?.getHTML());
    editComment.mutate(
      {
        postId,
        commentId: comment?.id ?? "",
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
    createComment.mutate({
      postId,
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
          <Button
            size="sm"
            disabled={editComment.isLoading}
            onClick={handleEdit}
          >
            {editComment.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={createComment.isLoading}
            onClick={handleCreate}
          >
            {createComment.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Comment
          </Button>
        )}
      </div>
    </div>
  );
}
