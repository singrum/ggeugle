import { type MetaFunction } from "react-router";
import { sampleRules } from "~/constants/sample-rules";
import { mergedMeta } from "~/lib/utils";
import RulesView from "../+components/rules-view/rules-view";
import RulesViewContent from "../+components/rules-view/rules-view-content";
import RulesViewDescription from "../+components/rules-view/rules-view-description";
import RulesViewHeader from "../+components/rules-view/rules-view-header";
import RulesViewTitle from "../+components/rules-view/rules-view-title";
import KkutuRuleSettings from "./+components/kkutu-rule-settings";

export const meta: MetaFunction = ({ matches }) => {
  const currentMeta = [{ title: "기본 룰 | 끝말잇기 엔진" }];

  return mergedMeta(matches, currentMeta);
};
export default function Sample() {
  return (
    <RulesView
      isSample={true}
      rules={sampleRules.map((e, i) => ({
        id: e.id,
        order: i,
        metadata: e.metadata,
      }))}
    >
      <RulesViewHeader>
        <RulesViewTitle>기본 룰</RulesViewTitle>
        <RulesViewDescription>기본 끝말잇기 룰 목록</RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent />

      <RulesViewHeader>
        <RulesViewTitle>끄투 코리아</RulesViewTitle>
        <RulesViewDescription>끄투 코리아 룰 설정</RulesViewDescription>
      </RulesViewHeader>
      <KkutuRuleSettings />
    </RulesView>
  );
}
