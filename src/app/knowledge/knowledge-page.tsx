import { UseKnowledgePath } from "@/hooks/use-knowledge-path";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export default function KnowledgePage() {
  const path = UseKnowledgePath();
  const [content, setContent] = useState<null | string>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // path가 바뀌었을 때만 상태 초기화
    setNotFound(false);
    setContent(null);

    fetch(`/knowledge/${path.join("/")}.md`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.text();
      })
      .then((text) => {
        if (text) setContent(text);
      })
      .catch(() => {
        setNotFound(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.join("/")]); // path 배열을 문자열로 변환하여 의존성 설정

  if (notFound) {
    return <div>요청하신 문서를 찾을 수 없습니다 (404)</div>;
  }

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
