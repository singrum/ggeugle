import { Adsense } from "@ctrl/react-adsense";
import { useLoaderData, type MetaFunction } from "react-router";
import { storage } from "~/lib/storage/storage";
import { mergedMeta, metaTitle } from "~/lib/utils";
import RulesView from "../+components/rules-view/rules-view";
import RulesViewContent from "../+components/rules-view/rules-view-content";
import RulesViewDescription from "../+components/rules-view/rules-view-description";
import RulesViewHeader from "../+components/rules-view/rules-view-header";
import RulesViewTitle from "../+components/rules-view/rules-view-title";

export const meta: MetaFunction = ({ matches }) => {
  return mergedMeta(matches, [...metaTitle("보관함 | 끝말잇기 엔진")]);
};

export function shouldRevalidate() {
  return true;
}

export async function clientLoader() {
  const rules = await storage.getAllRuleMetas();
  return {
    rules: rules,
  };
}
export function HydrateFallback() {
  return (
    <RulesView isSample={false} rules={[]}>
      <RulesViewHeader>
        <RulesViewTitle>보관함</RulesViewTitle>
        <RulesViewDescription>이 기기에 저장된 룰 목록</RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent loading={true} />
    </RulesView>
  );
}

export default function StorageIndex() {
  const { rules } = useLoaderData<typeof clientLoader>();

  return (
    <RulesView isSample={false} rules={rules}>
      <div className="w-full h-40 flex justify-center lg:p-6 lg:pb-0">
        <Adsense
          client="ca-pub-3218283453997693"
          slot="3239247288"
          style={{ width: "100%", display: "block" }}
          format="fluid"
        />
      </div>
      <RulesViewHeader>
        <RulesViewTitle>보관함</RulesViewTitle>
        <RulesViewDescription>이 기기에 저장된 룰 목록</RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent />
    </RulesView>
  );
}
