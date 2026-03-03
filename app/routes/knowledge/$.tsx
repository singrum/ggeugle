import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import { redirect, useLoaderData } from "react-router";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import KnowledgeHeader from "./+components/knowledge-header";

export async function loader({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const path = params["*"] || "";
  const url = new URL(request.url);
  const encodedPath = path
    .split("/")
    .map((part: string) => encodeURIComponent(part))
    .join("/");
  const fileUrl = `${url.protocol}//${url.host}/docs/${encodedPath}.md`;

  const file = await fetch(fileUrl);
  if (!file.ok) {
    return redirect("/knowledge");
  }

  const data = await file.text();
  return { data };
}

export default function Knowledge() {
  const { data } = useLoaderData();

  return (
    <div>
      <div className="prose dark:prose-invert mx-auto w-full max-w-3xl space-y-16 p-6 pb-36 break-keep ">
        <KnowledgeHeader />
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          skipHtml={false}
        >
          {data}
        </ReactMarkdown>
      </div>
    </div>
  );
}
