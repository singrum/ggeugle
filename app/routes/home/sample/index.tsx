import { type MetaFunction } from "react-router";
import { sampleRules } from "~/constants/sample-rules";
import RulesView from "../+components/rules-view/rules-view";
import RulesViewContent from "../+components/rules-view/rules-view-content";
import RulesViewDescription from "../+components/rules-view/rules-view-description";
import RulesViewHeader from "../+components/rules-view/rules-view-header";
import RulesViewTitle from "../+components/rules-view/rules-view-title";

export const meta: MetaFunction = () => {
  return [{ title: "기본 룰" }];
};

export default function Sample() {
  return (
    <RulesView
      isSample={true}
      rules={sampleRules.map((e) => ({
        id: e.metadata.id,
        title: e.metadata.title,
        color: e.metadata.color,
        updatedAt: e.metadata.updatedAt,
      }))}
    >
      <RulesViewHeader>
        <RulesViewTitle>기본 룰</RulesViewTitle>
        <RulesViewDescription>기본 끝말잇기 룰 목록</RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent />
    </RulesView>
  );
}
