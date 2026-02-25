import { Outlet, useLoaderData, type MetaFunction } from "react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { Card } from "~/components/ui/card";
import { sampleRules } from "~/constants/sample-rules";
import { useMount } from "~/hooks/use-mount";
import SiteHeader from "~/routes/engine/$rule/+components/site-header/site-header";
export type LoaderData = {
  title: string;
  isSample: boolean;
};
async function getLoaderDataById(id: string): Promise<LoaderData | null> {
  const sampleRule = sampleRules.find((rule) => rule.metadata.id === id);

  if (sampleRule) {
    return {
      title: sampleRule.metadata.title,
      isSample: true,
    };
  }
  // 스토리지에서 검색
  // (구현 중)
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
}): Promise<{ data: LoaderData | null }> {
  // 샘플 룰에서 검색
  const data = await getLoaderDataById(params.rule);
  return { data };
}

clientLoader.hydrate = true;

export default function Layout() {
  const { data } = useLoaderData<typeof clientLoader>();

  if (!data) {
    return <div>404 - 규칙을 찾을 수 없습니다.</div>;
  }
  const mounted = useMount();
  if (!mounted) {
    return null;
  }
  return (
    <div className="[--header-height:calc(--spacing(14))] bg-sidebar">
      <SiteHeader ruleTitle={data.title} />
      <div className="h-[calc(100svh-var(--header-height))] flex">
        <AppSidebar />
        <div className="pr-2 pb-2 flex-1 h-full">
          <Card className="rounded-lg h-full p-0 overflow-hidden bg-background border dark:border-0 @container/main ">
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
}
