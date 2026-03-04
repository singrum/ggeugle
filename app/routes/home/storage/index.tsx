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
        <RulesViewDescription>
          이 기기에 저장된 룰 목록
          <br />
          기기의 용량을 차지하므로 필요 없는 룰은 삭제하는 것을 권장드립니다.
        </RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent loading={true} />
    </RulesView>
  );
}

export default function StorageIndex() {
  const { rules } = useLoaderData<typeof clientLoader>();

  return (
    <RulesView isSample={false} rules={rules}>
      <RulesViewHeader>
        <RulesViewTitle>보관함</RulesViewTitle>
        <RulesViewDescription>
          이 기기에 저장된 룰 목록
          <br />
          기기의 용량을 차지하므로 필요 없는 룰은 삭제하는 것을 권장드립니다.
        </RulesViewDescription>
      </RulesViewHeader>
      <RulesViewContent />
    </RulesView>
  );
}
