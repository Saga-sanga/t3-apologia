import { EditorProps } from "@/components/editor";
import { useEdgeStore } from "@/lib/edgestore";
import type EditorJS from "@editorjs/editorjs";
import { OutputData } from "@editorjs/editorjs";
import { useCallback } from "react";

export function useEditorJS() {
  const { edgestore } = useEdgeStore();

  return useCallback(
    async (
      post: EditorProps["post"],
      ref: React.MutableRefObject<EditorJS | undefined>,
      saveBlocks: (blocks: OutputData) => void,
    ) => {
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

            saveBlocks(blocks);
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
    },
    [],
  );
}
