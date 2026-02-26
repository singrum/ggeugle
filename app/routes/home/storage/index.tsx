import { useLoaderData } from "react-router";
import { storage } from "~/lib/storage/storage";
import RulesView from "../+components/rules-view/rules-view";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "룰 보관함" }];
}

export async function clientLoader() {
  const rules = await storage.rule.toArray();
  return {
    rules: rules.map((e) => ({
      id: e.id,
      title: e.ruleForm.metadata.title,
      color: e.ruleForm.metadata.color,
      updatedAt: e.ruleForm.metadata.updatedAt,
    })),
  };
}

export default function Storage() {
  const { rules } = useLoaderData<typeof clientLoader>();

  return <RulesView title="룰 보관함" rules={rules} />;
}
