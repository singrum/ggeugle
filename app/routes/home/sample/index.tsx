import { Adsense } from "@ctrl/react-adsense";
import { type MetaFunction } from "react-router";
import { sampleRules } from "~/constants/sample-rules";
import { useIsMobile } from "~/hooks/use-mobile";
import { mergedMeta, metaTitle } from "~/lib/utils";
import RulesView from "../+components/rules-view/rules-view";
import RulesViewContent from "../+components/rules-view/rules-view-content";
import RulesViewDescription from "../+components/rules-view/rules-view-description";
import RulesViewHeader from "../+components/rules-view/rules-view-header";
import RulesViewTitle from "../+components/rules-view/rules-view-title";
import KkutuRuleSettings from "./+components/kkutu-rule-settings";
import Kkutu3RuleSettings from "./+components/kkutu3-rule-settings";

export const meta: MetaFunction = ({ matches }) => {
  return mergedMeta(matches, [...metaTitle("기본 룰 | 끝말잇기 엔진")]);
};
export default function Sample() {
  const isMobile = useIsMobile();
  return (
    <RulesView
      isSample={true}
      rules={sampleRules.map((e, i) => ({
        id: e.id,
        order: i,
        metadata: e.metadata,
      }))}
    >
      <div className="w-full justify-center p-6 pb-0 flex">
        <div className="w-full flex justify-center">
          <Adsense
            client="ca-pub-3218283453997693"
            slot="3239247288"
            style={{
              display: "inline-block",
              ...(isMobile
                ? { width: "100%" }
                : { width: "100%", height: "160px" }),
            }}
            format="fluid"
            responsive="true"
          />
        </div>
      </div>
      <RulesViewHeader>
        <RulesViewTitle>기본 룰</RulesViewTitle>
        <RulesViewDescription>기본 끝말잇기 룰 목록</RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent />
      <div className="w-full justify-center p-6 py-0 flex md:hidden">
        <div className="w-full flex justify-center">
          <Adsense
            client="ca-pub-3218283453997693"
            slot="7736635738"
            style={{
              display: "inline-block",
              ...{ width: "100%" },
            }}
            format="fluid"
            responsive="true"
          />
        </div>
      </div>
      <div className="p-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-9 px-6 pb-6 grid-rows-1">
        <div className="col-span-2 flex flex-col">
          <RulesViewHeader className="p-0 pb-6">
            <RulesViewTitle>끄투 코리아</RulesViewTitle>
            <RulesViewDescription>끄투 코리아 룰 설정</RulesViewDescription>
          </RulesViewHeader>
          <KkutuRuleSettings />
        </div>
        <div className="col-span-2 flex flex-col">
          <RulesViewHeader className="p-0 pb-6">
            <RulesViewTitle>끄투 3 (끄투 온라인)</RulesViewTitle>
            <RulesViewDescription>끄투 3 룰 설정</RulesViewDescription>
          </RulesViewHeader>
          <Kkutu3RuleSettings />
        </div>
      </div>
    </RulesView>
  );
}
