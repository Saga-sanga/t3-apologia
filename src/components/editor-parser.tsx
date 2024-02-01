// edjsHTML tranforms editor js blocks to html
import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";

function imageParser(block: OutputBlockData) {
  console.log({ file: block.data });
  return `<figure><img src=${
    block.data.file.url
  } alt="Image representation" />${
    block.data.caption &&
    `<figcaption style="text-align: center">${block.data.caption}</figcaption>`
  }</figure>`;
}
// this function parses strings (html elements) to html
import parse from "html-react-parser";
const edjsParser = edjsHTML({ imageTool: imageParser });

export default function EditorTextParser({ data }: { data: OutputData }) {
  // array of html elements
  const html = edjsParser.parse(data);

  return <div className="text-container">{parse(html.join(""))}</div>;
}
