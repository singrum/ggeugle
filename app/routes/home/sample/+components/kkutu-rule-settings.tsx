import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { kkutuInfo } from "~/constants/rule";
import { getKkutuRuleTitle } from "~/lib/utils";
import {
  KkutuRuleStoreProvider,
  useKkutuRuleStore,
  useKkutuRuleStoreApi,
} from "./kkutu-rule-provider";

export default function KkutuRuleSettings() {
  return (
    <KkutuRuleStoreProvider>
      <KkutuRuleSettingsInner />
    </KkutuRuleStoreProvider>
  );
}

function KkutuRuleSettingsInner() {
  const kkutuLocalRule = useKkutuRuleStore((state) => state.kkutuLocalRule);
  const storeApi = useKkutuRuleStoreApi();
  return (
    <Card className="px-6 bg-transparent border p-4 col-span-2 w-full flex-1 justify-between">
      <div className="grid w-full grid-cols-2 gap-y-4">
        <div className="flex h-9 items-center text-sm font-medium">
          게임 유형
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 w-full justify-between text-sm font-normal"
              variant="outline"
            >
              {kkutuInfo.gameType[kkutuLocalRule.gameType]}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuRadioGroup
              value={String(kkutuLocalRule.gameType)}
              onValueChange={(val) =>
                storeApi.setState((state) => {
                  state.kkutuLocalRule.gameType = Number(val);
                })
              }
            >
              {kkutuInfo.gameType.map((e, i) => (
                <DropdownMenuRadioItem value={String(i)} key={e}>
                  {e}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex h-8 items-center text-sm font-medium">
          특수 규칙
        </div>

        <div className="flex min-h-9 flex-wrap items-center gap-x-6">
          <Label className="h-9">
            <Checkbox
              checked={kkutuLocalRule.manner === 1}
              onCheckedChange={(e) => {
                storeApi.setState((state) => {
                  state.kkutuLocalRule.manner = e ? 1 : 0;
                });
              }}
            />
            <div className="">매너</div>
          </Label>

          <Label className="h-9">
            <Checkbox
              checked={kkutuLocalRule.manner === 2}
              onCheckedChange={(e) => {
                storeApi.setState((state) => {
                  state.kkutuLocalRule.manner = e ? 2 : 0;
                });
              }}
            />
            <div>젠틀</div>
          </Label>
          <Label className="h-9">
            <Checkbox
              checked={kkutuLocalRule.injeong}
              onCheckedChange={(e) => {
                storeApi.setState((state) => {
                  state.kkutuLocalRule.injeong = e as boolean;
                });
              }}
            />
            <div>어인정</div>
          </Label>
        </div>
      </div>

      <Button variant="secondary" asChild>
        <Link
          to={`/engine/${encodeURIComponent(getKkutuRuleTitle(kkutuLocalRule))}`}
        >
          확인
        </Link>
      </Button>
    </Card>
  );
}
