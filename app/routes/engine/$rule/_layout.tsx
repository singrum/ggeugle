import { useEffect, useState } from "react";
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from "react-router";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import { sampleRules } from "~/constants/sample-rules";
import { storage } from "~/lib/storage/storage";
import { getRuleFormById } from "~/lib/utils";
import { AppSidebar } from "~/routes/engine/$rule/+components/nav-sidebar/app-sidebar";
import SiteHeader from "~/routes/engine/$rule/+components/site-header/site-header";
import { WcStoreProvider } from "~/stores/wc-store-provider";
import type { RuleForm } from "~/types/rule";
export type LoaderData = {
  title: string;
  updatedAt: number;
  isSample: boolean;
  color: string;
  id: string;
};

export async function getLoaderDataById(
  id: string,
): Promise<LoaderData | null> {
  const sampleRule = sampleRules.find((rule) => rule.metadata.id === id);

  if (sampleRule) {
    return {
      title: sampleRule.metadata.title,
      isSample: true,
      id,
      updatedAt: sampleRule.metadata.updatedAt,
      color: sampleRule.metadata.color,
    };
  }
  // 스토리지에서 검색
  const data = await storage.getRuleFormById(id);
  if (data) {
    return {
      title: data.metadata.title,
      isSample: false,
      id,
      updatedAt: data.metadata.updatedAt,
      color: data.metadata.color,
    };
  }
  return null;
}

export const meta: MetaFunction<typeof clientLoader> = ({ loaderData }) => {
  const title =
    (loaderData as { data: LoaderData | null })?.data?.title ?? "로딩 중";

  return [{ title: `${title}` }];
};

export async function clientLoader({
  params,
}: {
  params: { rule: string };
}): Promise<{ data: LoaderData }> {
  // 샘플 룰에서 검색
  const data = await getLoaderDataById(params.rule);
  if (!data) {
    redirect("/home");
  }
  return { data: data! };
}

clientLoader.hydrate = true;

export default function Layout() {
  const { data } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [ruleForm, setRuleForm] = useState<RuleForm | null>(null);
  useEffect(() => {
    (async function () {
      const result = await getRuleFormById(data.id);
      if (!result) {
        toast.error("해당 룰을 불러올 수 없습니다.");
        navigate("/home");
        return;
      }
      setRuleForm(result.ruleForm);
    })();
  }, [data.id, data.updatedAt]);

  if (!ruleForm) {
    <div className="[--header-height:calc(--spacing(14))] bg-sidebar">
      <SiteHeader loaderData={data} />
      <div className="h-[calc(100svh-var(--header-height))] flex">
        <AppSidebar />
        <div className="pr-2 pb-2 flex-1 h-full">
          <Card className="rounded-lg h-full p-0 overflow-hidden bg-background border dark:border-0 @container/main ">
            <Outlet />
          </Card>
        </div>
      </div>
    </div>;
  } else {
    return (
      <WcStoreProvider
        key={ruleForm.metadata.id + ruleForm.metadata.updatedAt}
        ruleForm={ruleForm}
      >
        <div className="[--header-height:calc(--spacing(14))] bg-sidebar">
          <SiteHeader loaderData={data} />
          <div className="h-[calc(100svh-var(--header-height))] flex">
            <AppSidebar />
            <div className="pr-2 pb-2 flex-1 h-full">
              <Card className="rounded-lg h-full p-0 overflow-hidden bg-background border dark:border-0 @container/main ">
                <Outlet />
              </Card>
            </div>
          </div>
        </div>
      </WcStoreProvider>
    );
  }
}
