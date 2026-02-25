import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "룰 보관함" }];
}

export default function Storage() {
  return <div></div>;
}
