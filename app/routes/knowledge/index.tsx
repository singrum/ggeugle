import { redirect } from "react-router";

export async function loader() {
  return redirect(`/knowledge/${encodeURIComponent("개요")}`);
}
