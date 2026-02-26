import { isEqual } from "lodash-es";
import { ChevronDownIcon, RotateCcw, Save, SaveAll } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { useRuleEditorStore } from "../rule-editor-store-provider";

export function RuleEditFooter() {
  const isSample = useRuleEditorStore((e) => e.isSample);
  const restore = useRuleEditorStore((e) => e.restoreLocalRuleForm);
  const ruleForm = useRuleEditorStore((e) => e.ruleForm);
  const localRuleForm = useRuleEditorStore((e) => e.localRuleForm);
  const isNotChanged = isEqual(ruleForm, localRuleForm);
  return (
    <div className="border-t flex flex-col p-4 gap-4 break-keep">
      {isSample && (
        <div className="text-xs text-muted-foreground text-balance text-center">
          기본 룰은 수정할 수 없습니다. 변경 내용은 보관함에 저장됩니다.
        </div>
      )}

      <div className=" grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={restore} disabled={isNotChanged}>
          <RotateCcw /> 되돌리기
        </Button>
        {!isSample ? (
          <ButtonGroup className="w-full">
            <Button className="flex-1">
              <Save className="stroke-primary-foreground" />
              저장
            </Button>
            <Separator orientation="vertical" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="pl-2!">
                  <ChevronDownIcon className="stroke-primary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Save />
                    저장
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SaveAll />
                    복사본 저장
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        ) : (
          <Button className="flex-1">
            <SaveAll className="stroke-primary-foreground" />
            복사본 저장
          </Button>
        )}
      </div>
    </div>
  );
}
