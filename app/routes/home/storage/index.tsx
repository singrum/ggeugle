import { useLoaderData } from "react-router";
import { storage } from "~/lib/storage/storage";
import RulesView from "../+components/rules-view/rules-view";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "보관함" }];
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

  return (
    <RulesView
      title="보관함"
      rules={rules}
      isSample={false}
      key={rules.reduce((acc, curr) => Math.max(acc, curr.updatedAt), 0)}
    />
  );
}
