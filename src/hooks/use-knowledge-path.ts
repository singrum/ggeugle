import { useLocation } from "react-router-dom";

export function UseKnowledgePath(): string[] {
  const location = useLocation();
  const pageUrl = location.pathname
    .replace(/^\/|\/$/g, "") // 양쪽 끝 슬래시 제거
    .split("/")
    .slice(1)
    .map((e) => decodeURI(e));
  const crumbs = [];
  if (pageUrl.length === 0) {
    crumbs.push("개요");
  } else {
    crumbs.push(...pageUrl);
  }
  return crumbs;
}
