import { useIsTablet } from "@/hooks/use-tablet";
import MobileSampleRulesTrigger from "../sample-rules/mobile-sample-rules-trigger";

export default function RuleSettingsHeader() {
  const isTablet = useIsTablet();
  return (
    <div className="bg-background flex items-center">
      <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between px-4 py-4 md:px-12 lg:py-4">
        <h1 className="px-2 text-xl font-medium lg:text-2xl">룰 설정</h1>
        {isTablet && <MobileSampleRulesTrigger />}
      </div>
    </div>
  );
}
