import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { kkutuInfo } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import { ChevronsUpDown } from "lucide-react";
import { NavLink } from "react-router";

export default function KkutuRuleButton() {
  const kkutuLocalRule = useWcStore((e) => e.kkutuLocalRule);
  const setKkutuRule = useWcStore((e) => e.setKkutuRule);

  return (
    <Card className="bg-card dark:bg-muted/50 relative w-full border transition-all dark:border-0">
      <CardHeader>
        <CardTitle className="flex justify-between">끄투코리아</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-fit grid-cols-2 gap-y-4">
          <div className="flex h-9 items-center text-sm font-medium">
            게임 유형
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-9 w-full max-w-[150px] justify-between text-sm font-normal"
                variant="outline"
              >
                {kkutuInfo.gameType[kkutuLocalRule.gameType]}
                <ChevronsUpDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50">
              <DropdownMenuRadioGroup
                value={String(kkutuLocalRule.gameType)}
                onValueChange={(val) =>
                  useWcStore.setState((state) => {
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

          <div className="mb-2 flex min-h-9 flex-wrap items-center gap-x-6">
            <Label className="h-9">
              <Checkbox
                checked={kkutuLocalRule.manner === 1}
                onCheckedChange={(e) => {
                  useWcStore.setState((state) => {
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
                  useWcStore.setState((state) => {
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
                  useWcStore.setState((state) => {
                    state.kkutuLocalRule.injeong = e as boolean;
                  });
                }}
              />
              <div>어인정</div>
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <NavLink
          to={`/home?rule=끄투코리아-${kkutuInfo.gameType[kkutuLocalRule.gameType]}-${kkutuInfo.injeong[Number(kkutuLocalRule.injeong)]}-${kkutuInfo.manner[kkutuLocalRule.manner]}`}
          className="w-full"
        >
          <Button
            variant={"secondary"}
            onClick={() => setKkutuRule()}
            size="lg"
            className="w-full cursor-pointer"
          >
            저장
          </Button>
        </NavLink>
      </CardFooter>
    </Card>
  );
}
