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
import { kkutu3Info } from "~/constants/rule";
import { getKkutu3RuleTitle } from "~/lib/utils";
import {
  Kkutu3RuleStoreProvider,
  useKkutu3RuleStore,
  useKkutu3RuleStoreApi,
} from "./kkutu3-rule-provider";

export default function Kkutu3RuleSettings() {
  return (
    <Kkutu3RuleStoreProvider>
      <Kkutu3RuleSettingsInner />
    </Kkutu3RuleStoreProvider>
  );
}

function Kkutu3RuleSettingsInner() {
  const kkutu3LocalRule = useKkutu3RuleStore((state) => state.kkutu3LocalRule);
  const storeApi = useKkutu3RuleStoreApi();
  return (
    <Card className="px-6 bg-transparent border p-4 col-span-2 w-full">
      <div className="grid w-fit grid-cols-2 gap-y-4">
        <div className="flex h-9 items-center text-sm font-medium">
          게임 유형
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 w-full justify-between text-sm font-normal"
              variant="outline"
            >
              {kkutu3Info.gameType[kkutu3LocalRule.gameType]}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuRadioGroup
              value={String(kkutu3LocalRule.gameType)}
              onValueChange={(val) =>
                storeApi.setState((state) => {
                  state.kkutu3LocalRule.gameType = Number(val);
                })
              }
            >
              {kkutu3Info.gameType.map((e, i) => (
                <DropdownMenuRadioItem value={String(i)} key={e}>
                  {e}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex h-9 items-center text-sm font-medium">
          기본 낱말집
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 w-full justify-between text-sm font-normal"
              variant="outline"
            >
              {kkutu3Info.dict[kkutu3LocalRule.dict]}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuRadioGroup
              value={String(kkutu3LocalRule.dict)}
              onValueChange={(val) =>
                storeApi.setState((state) => {
                  state.kkutu3LocalRule.dict = Number(val);
                })
              }
            >
              {kkutu3Info.dict.map((e, i) => (
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
              checked={kkutu3LocalRule.manner === true}
              onCheckedChange={(e) => {
                storeApi.setState((state) => {
                  state.kkutu3LocalRule.manner = e ? true : false;
                });
              }}
            />
            <div className="">매너</div>
          </Label>

          <Label className="h-9">
            <Checkbox
              checked={kkutu3LocalRule.three === true}
              onCheckedChange={(e) => {
                storeApi.setState((state) => {
                  state.kkutu3LocalRule.three = e ? true : false;
                });
              }}
            />
            <div>쿵쿵따</div>
          </Label>
        </div>
      </div>

      <Button variant="secondary" asChild>
        <Link
          to={`/engine/${encodeURIComponent(getKkutu3RuleTitle(kkutu3LocalRule))}`}
        >
          확인
        </Link>
      </Button>
    </Card>
  );
}
