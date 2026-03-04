import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import { useLoaderData, type MetaFunction } from "react-router";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { mergedMeta } from "~/lib/utils";
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

  const data = await file.text();
  return { data, ok: file.ok };
}

export const meta: MetaFunction = ({ params, matches }) => {
  return mergedMeta(matches, [
    {
      title: `${(params["*"] ?? "지식").replace("/", " - ")} | 끝말잇기 엔진`,
    },
  ]);
};

export default function Knowledge() {
  const { data, ok } = useLoaderData();

  if (!ok) {
    return (
      <div className="prose dark:prose-invert mx-auto w-full max-w-3xl space-y-16 p-6 pb-36 break-keep ">
        <p className="text-base">문서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
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
  );
}
