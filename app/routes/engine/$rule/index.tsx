import { redirect } from "react-router";

// /sample로 리다이렉트
export function loader({ params }: { params: { rule: string } }) {
  return redirect(`/engine/${encodeURIComponent(params.rule)}/search`);
}
