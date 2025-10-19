import { Button } from "@/components/ui/button";
import { isEqualRules } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { NavLink } from "react-router";

export default function RuleSettingsAlertBar() {
  const rule = useWcStore((e) => e.rule);
  const localRule = useWcStore((e) => e.localRule);
  const updateRule = useWcStore((e) => e.updateRule);
  const isValidJson = useWcStore((e) => e.isValidJson);
  const restoreLocalRule = useWcStore((e) => e.restoreLocalRule);

  return (
    !isEqualRules(rule, localRule) &&
    isValidJson && (
      <div className="sticky bottom-4 mx-auto w-full max-w-screen-lg px-4">
        <div className="bg-primary text-primary-foreground flex items-center justify-between rounded-full border px-4 py-4 pl-6 shadow-md md:mx-6 md:px-6 md:py-4">
          <div className="font-medium">변경 사항이 있습니다.</div>
          <div className="flex gap-0">
            <Button
              variant="ghost"
              className="hover:text-primary-foreground hover:bg-primary-foreground/5 rounded-full"
              onClick={() => {
                restoreLocalRule();
              }}
            >
              되돌리기
            </Button>
            <NavLink to={`/home?rule=custom`}>
              <Button
                className="bg-primary-foreground hover:bg-primary-foreground/80 cursor-pointer rounded-full text-black"
                onClick={() => {
                  useWcStore.setState((state) => {
                    state.localRule.metadata = undefined;
                  });
                  updateRule();
                }}
              >
                저장
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    )
  );
}
