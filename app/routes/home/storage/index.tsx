import { useLoaderData } from "react-router";
import { storage } from "~/lib/storage/storage";
import type { Route } from "../+types";
import Storage from "./+components/storage-rules-view/storage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "룰 보관함" }];
}

export function shouldRevalidate() {
  return true;
}

export async function clientLoader() {
  const rules = await storage.rule.toArray();
  return {
    rules: rules

      .map((e) => ({
        id: e.id,
        title: e.ruleForm.metadata.title,
        color: e.ruleForm.metadata.color,
        updatedAt: e.ruleForm.metadata.updatedAt,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt),
  };
}

export default function StorageIndex() {
  const { rules } = useLoaderData<typeof clientLoader>();

  return <Storage rules={rules} />;
}
