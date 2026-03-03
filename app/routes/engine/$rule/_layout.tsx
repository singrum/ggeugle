import { useEffect, useState } from "react";
import {
  Outlet,
  redirect,
  useLoaderData,
  type MetaFunction,
} from "react-router";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import { samplePrecedenceMaps } from "~/constants/sample-precedence-maps";
import { sampleRules } from "~/constants/sample-rules";
import { navInfo } from "~/constants/sidebar";
import { useIsTablet } from "~/hooks/use-tablet";
import { storage } from "~/lib/storage/storage";
import { getKkutuRule, getKkutuRuleForm, getRuleFormById } from "~/lib/utils";
import { AppSidebar } from "~/routes/engine/$rule/+components/nav-sidebar/app-sidebar";
import SiteHeader from "~/routes/engine/$rule/+components/site-header/site-header";
import { WcStoreProvider } from "~/stores/wc-store-provider";
import type { RuleForm } from "~/types/rule";
import type { PrecInfo } from "~/types/search";
import MobileNav from "./+components/mobile-nav";
export type LoaderData = {
  title: string;
  updatedAt: number;
  isSample: boolean;
  color: string;
  id: string;
};

export async function getLoaderDataById(id: string): Promise<LoaderData> {
  const sampleRule = sampleRules.find((rule) => rule.id === id);
  // 샘플 룰에서 검색
  if (sampleRule) {
    return {
      title: sampleRule.metadata.title,
      isSample: true,
      id,
      updatedAt: sampleRule.metadata.updatedAt,
      color: sampleRule.metadata.color,
    };
  }

  // 끄투룰에서 검색
  const kkutuRule = getKkutuRule(id);
  if (kkutuRule) {
    const kkutuRuleForm = getKkutuRuleForm(kkutuRule);
    if (kkutuRuleForm) {
      return {
        title: kkutuRuleForm.metadata.title,
        isSample: true,
        id,
        updatedAt: kkutuRuleForm.metadata.updatedAt,
        color: kkutuRuleForm.metadata.color,
      };
    }
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
  throw new Error("Rule not found");
}

export const meta: MetaFunction<typeof clientLoader> = ({
  location,
  loaderData,
}) => {
  const { pathname } = location;
  const lastPath = pathname.split("/").at(-1);
  const navTitle = navInfo.find((nav) => nav.key === lastPath)?.title;

  const title =
    (loaderData as { data: LoaderData | null })?.data?.title ?? "로딩 중";

  return [{ title: `${title} - ${navTitle ?? ""} | 끝말잇기 엔진` }];
};

export async function clientLoader({
  params,
}: {
  params: { rule: string };
}): Promise<{ data: LoaderData }> {
  try {
    const data = await getLoaderDataById(params.rule);
    return { data };
  } catch (error) {
    throw redirect("/home");
  }
}

clientLoader.hydrate = true;

export default function Layout() {
  const { data } = useLoaderData<typeof clientLoader>();
  const [ruleForm, setRuleForm] = useState<RuleForm | null>(null);
  const [prec, setPrec] = useState<PrecInfo | null>(null);
  const isTablet = useIsTablet();

  useEffect(() => {
    (async function () {
      try {
        const result = await getRuleFormById(data.id);

        let prec = await storage.getPrecByRuleFormId(data.id);

        if (!prec) {
          if (data.isSample && samplePrecedenceMaps[data.id]) {
            const precMaps = samplePrecedenceMaps[data.id];
            prec = {
              rule: 0,
              maps: {
                edge: precMaps.edge || {},
                node: precMaps.node || {},
              },
            };
          } else {
            prec = { rule: 0, maps: { edge: {}, node: {} } };
          }
        }
        setPrec(prec);
        setRuleForm(result.ruleForm);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      }
    })();
  }, [data.id, data.updatedAt]);

  if (!ruleForm || !prec) {
    return null;
  } else {
    return (
      <WcStoreProvider
        key={ruleForm.id + ruleForm.metadata.updatedAt}
        ruleForm={ruleForm}
        prec={prec}
      >
        <div className="[--header-height:calc(--spacing(14))] bg-sidebar flex flex-col h-svh">
          <div className="flex-1 min-h-0 overflow-auto flex flex-col relative">
            <SiteHeader loaderData={data} />
            <div className="flex-1 lg:flex min-h-auto lg:min-h-0">
              {!isTablet && <AppSidebar />}
              <div className="lg:pr-2 lg:pb-2 flex-1 h-full">
                <Card className="rounded-none lg:rounded-lg h-full p-0 bg-background lg:border lg:dark:border-0 ">
                  <Outlet />
                </Card>
              </div>
            </div>
          </div>
          {isTablet && <MobileNav />}
        </div>
      </WcStoreProvider>
    );
  }
}
