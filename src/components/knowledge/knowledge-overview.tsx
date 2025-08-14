import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export default function KnowledgeOverview() {
  const [content, setContent] = useState<null | string>(null);

  useEffect(() => {
    // path가 바뀌었을 때만 상태 초기화

    setContent(null);

    fetch(`/knowledge/overview.md`)
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.text();
      })
      .then((text) => {
        if (text) setContent(text);
      });
  }, []);

  return (
    content && (
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    )
  );
}
