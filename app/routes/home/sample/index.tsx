import { type MetaFunction } from "react-router";
import { sampleRules } from "~/constants/sample-rules";
import RulesView from "../+components/rules-view/rules-view";

export const meta: MetaFunction = () => {
  return [{ title: "기본 룰" }];
};

export default function Sample() {
  return (
    <RulesView
      title="기본 룰"
      rules={sampleRules.map((e) => ({
        id: e.metadata.id,
        title: e.metadata.title,
        color: e.metadata.color,
        updatedAt: e.metadata.updatedAt,
      }))}
      isSample={true}
    />
  );
}
