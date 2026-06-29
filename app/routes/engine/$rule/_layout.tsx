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
import { navInfo } from "~/constants/sidebar";
import { useIsTablet } from "~/hooks/use-tablet";
import { storage } from "~/lib/storage/storage";
import {
  getLoaderDataById,
  getRuleFormById,
  getStaticLoaderDataById,
  mergedMeta,
  metaDescription,
  metaTitle,
} from "~/lib/utils";
import { AppSidebar } from "~/routes/engine/$rule/+components/nav-sidebar/app-sidebar";
import SiteHeader from "~/routes/engine/$rule/+components/site-header/site-header";
import { WcStoreProvider } from "~/stores/wc-store-provider";
import type { LoaderData, RuleForm } from "~/types/rule";
import type { PrecInfo } from "~/types/search";
import MobileNav from "./+components/mobile-nav";
import EngineLoading from "./search/+components/engine-loading";

export const meta: MetaFunction<typeof clientLoader> = ({
  location,
  loaderData,
  matches,
  params: { rule: ruleId },
}) => {
  const { pathname } = location;
  const lastPath = pathname.split("/").at(-1);
  const navTitle = navInfo.find((nav) => nav.key === lastPath)?.title;

  let title = getStaticLoaderDataById(ruleId!)?.title;
  if (!title) {
    title =
      (loaderData as { data: LoaderData | null })?.data?.title ?? "로딩 중";
  }

  return mergedMeta(matches, [
    ...metaTitle(`${title} - ${navTitle ?? ""} | 끝말잇기 엔진`),
    ...metaDescription(
      `끝말잇기 엔진에서 ${lastPath !== "game" ? `${title} 단어를 검색하고, 전략을 분석해보세요.` : `AI와 ${title} 끝말잇기를 즐겨보세요.`}`,
    ),
  ]);
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
export function HydrateFallback() {
  return <EngineLoading />;
}
export default function Layout() {
  const { data } = useLoaderData<typeof clientLoader>();
  const [ruleForm, setRuleForm] = useState<RuleForm | null>(null);
  const [prec, setPrec] = useState<PrecInfo | null>(null);
  const isTablet = useIsTablet();
  useEffect(() => {
    // 1. 테마 적용 로직
    const root = window.document.documentElement;

    // 기존에 붙어있던 theme- 관련 클래스들 제거
    root.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) root.classList.remove(cls);
    });

    // 현재 룰의 color 값 적용 (예: theme-red)
    if (data.color) {
      root.classList.add(`theme-${data.color}`);
    }

    // (선택 사항) 언마운트 시 클래스 제거
    return () => {
      if (data.color) root.classList.remove(`theme-${data.color}`);
    };
  }, [data.color]);
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
    return <EngineLoading />;
  } else {
    return (
      <WcStoreProvider
        key={ruleForm.id + ruleForm.metadata.updatedAt}
        ruleForm={ruleForm}
        prec={prec}
      >
        <div className="bg-sidebar flex flex-col lg:h-svh min-h-dvh lg:min-h-0">
          <div className="flex-1 min-h-0 flex flex-col lg:relative ">
            <SiteHeader loaderData={data} />
            <div className="flex-1 flex min-h-auto lg:min-h-0 flex-col lg:flex-row">
              {!isTablet && <AppSidebar />}
              <div className="lg:pr-2 lg:pb-2 flex-1 h-full flex flex-col">
                <Card className="rounded-none lg:rounded-lg h-full p-0 bg-background lg:border flex-1 flex">
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
