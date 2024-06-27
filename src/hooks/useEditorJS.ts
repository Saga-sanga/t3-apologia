import type { EditorProps } from "@/components/editor";
import { useEdgeStore } from "@/lib/edgestore";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";
import { useCallback } from "react";

export function useEditorJS(
  post: EditorProps["post"],
  ref: React.MutableRefObject<EditorJS | undefined>,
  saveBlocks: (blocks: OutputData) => void,
) {
  const { edgestore } = useEdgeStore();

  return useCallback(async () => {
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
        async onChange(api) {
          const blocks = await api.saver.save();

          saveBlocks(blocks);
        },
        placeholder: "Type here to start writing your post...",
        inlineToolbar: true,
        // @ts-expect-error: Json object type is unspecified, always changes with input
        data: post.content,
        tools: {
          header: Header,
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "ordered",
            },
          },
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
                        temporary: false,
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
  }, []);
}
