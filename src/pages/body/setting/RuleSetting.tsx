import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMenu } from "@/lib/store/useMenu";
import { cates, dicts, poses, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import React from "react";
import { SettnigMenu } from "./SettingMenu";
export function RuleSetting() {
  const [rule, setRuleForm, updateRule] = useWC((state) => [
    state.rule,
    state.setRuleForm,
    state.updateRule,
  ]);

  const setMenu = useMenu((state) => state.setMenu);

  return (
    <div className="flex flex-col">
      <DictSetting />
      <Separator className="my-4" />
      <PosSetting />
      <Separator className="my-4" />
      <CateSetting />
      <Separator className="my-4" />
      <ChanSetting />
      <Separator className="my-4" />
      <HeadIdxSetting />
      <Separator className="my-4" />
      <TailIdxSetting />
      <Separator className="my-4" />
      <RegexFilterSetting />
      <Separator className="my-4" />
      <AddedWordsSetting />
      <Separator className="my-4" />
      <div className="flex justify-end gap-2">
        <Button
          variant={"ghost"}
          onClick={() => {
            setRuleForm({ ...rule });
          }}
        >
          되돌리기
        </Button>
        <Button
          onClick={() => {
            updateRule();
            setMenu(0);
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

function DictSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="사전">
      <Select
        defaultValue={ruleForm.dict.toString()}
        onValueChange={(e) => {
          switch (parseInt(e)) {
            case 0:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, true, true, true],
              });
              break;
            case 1:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, false, false, false],
              });
              break;
            case 2:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
              });
              break;
          }
        }}
      >
        <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dicts.map((dict, i) => (
            <SelectItem className="text-xs" value={`${i}`} key={i}>
              {dict}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettnigMenu>
  );
}

function PosSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);

  return (
    <SettnigMenu name="품사">
      <div className="flex flex-wrap gap-1">
        {poses.map((e, i) => (
          <React.Fragment key={i}>
            <div
              className={cn(
                "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
                {
                  "bg-foreground text-background hover:bg-foreground hover:text-background":
                    ruleForm.pos[i],
                }
              )}
              onClick={() => {
                setRuleForm({
                  ...ruleForm,
                  pos: { ...ruleForm.pos, [i]: !ruleForm.pos[i] },
                });
              }}
            >
              {e}
            </div>
          </React.Fragment>
        ))}
      </div>
    </SettnigMenu>
  );
}

function CateSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="범주">
      <div>
        <div className="text-sm text-muted-foreground mb-2">
          우리말샘일 때만 설정 가능
        </div>
        <div className="flex flex-wrap gap-1">
          {cates.map((e, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
                  {
                    "bg-foreground text-background hover:bg-foreground hover:text-background":
                      ruleForm.cate[i],
                    "opacity-50": ruleForm.dict === 0 || ruleForm.dict === 1,
                  }
                )}
                onClick={() => {
                  if (ruleForm.dict === 2) {
                    setRuleForm({
                      ...ruleForm,
                      cate: { ...ruleForm.cate, [i]: !ruleForm.cate[i] },
                    });
                  }
                }}
              >
                {e}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </SettnigMenu>
  );
}

function ChanSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="두음법칙">
      <Select
        defaultValue={ruleForm.chan.toString()}
        onValueChange={(e) => setRuleForm({ ...ruleForm, chan: parseInt(e) })}
      >
        <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[
            "없음",
            "표준",
            "ㄹ→ㄴ→ㅇ",
            "ㄹ⇄ㄴ⇄ㅇ",
            "반전룰",
            "첸룰",
            "듭2룰",
          ].map((e, i) => (
            <SelectItem className="text-xs" value={`${i}`} key={i}>
              {e}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettnigMenu>
  );
}

function HeadIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="첫 글자">
      <div className="flex gap-1 items-center">
        <Select
          defaultValue={ruleForm.headDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, headDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-fit text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="0">
              앞에서
            </SelectItem>
            <SelectItem className="text-xs" value="1">
              뒤에서
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={ruleForm.headIdx}
          type="number"
          className="w-20 h-fit text-xs focus-visible:ring-offset-1 focus-visible:ring-1"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, headIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1">번째 글자</div>
      </div>
    </SettnigMenu>
  );
}

function TailIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="끝 글자">
      <div className="flex gap-1 items-center">
        <Select
          defaultValue={ruleForm.tailDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, tailDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-fit text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="0">
              앞에서
            </SelectItem>
            <SelectItem className="text-xs" value="1">
              뒤에서
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={ruleForm.tailIdx}
          type="number"
          className="w-20 h-fit text-xs focus-visible:ring-offset-1 focus-visible:ring-1"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, tailIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1 ">번째 글자</div>
      </div>
    </SettnigMenu>
  );
}

function MannerSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="매너">
      <div className="flex items-center space-x-2 px-1">
        <Checkbox
          id="manner"
          defaultChecked={ruleForm.manner}
          onCheckedChange={(e: boolean) => {
            setRuleForm({ ...ruleForm, manner: e });
          }}
        />
        <label
          htmlFor="manner"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          한방단어 제거
        </label>
      </div>
    </SettnigMenu>
  );
}

function AddedWordsSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettnigMenu name="단어 추가">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-xs">띄어쓰기로 구분</div>
        <Input
          value={ruleForm.addedWords}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, addedWords: e.target.value })
          }
        />
      </div>
    </SettnigMenu>
  );
}

const RegexExamples = [
  {
    title: "모든 단어",
    content: String.raw`.*`,
  },
  {
    title: "'가', '나', '다'로 시작하지 않는 단어",
    content: String.raw`[^가나다].*`,
  },
  {
    title: "'가', '나', '다'로 끝나지 않는 단어",
    content: String.raw`.*[^가나다]`,
  },
  {
    title: "첫 글자와 끝 글자가 같은 단어",
    content: String.raw`(.).*(?!\1).`,
  },
  {
    title: "2글자 또는 5글자 단어",
    content: String.raw`(.{2}|.{5})`,
  },
  {
    title: "3글자 이상 단어",
    content: String.raw`(.{3}).*`,
  },
  {
    title: "4글자 이하 단어",
    content: String.raw`.{0,4}`,
  },
  {
    title: "짝수 글자 단어",
    content: String.raw`(..)*`,
  },
  {
    title: "홀수 글자 단어",
    content: String.raw`.(..)*`,
  },
  {
    title: "'가' 또는 '나'를 포함하는 단어",
    content: String.raw`.*[가나].*`,
  },
  {
    title: "'가' 또는 '나'를 포함하지 않는 단어",
    content: String.raw`.*[^가나].*`,
  },
];

function RegexFilterSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);

  return (
    <SettnigMenu name="단어 필터">
      <div>
        <Input
          value={ruleForm.regexFilter}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, regexFilter: e.target.value })
          }
        />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none mx-1">
            <AccordionTrigger className="text-sm pb-0">예시</AccordionTrigger>
            <AccordionContent className="font-semibold">
              <div className="flex flex-col gap-2 py-2">
                {RegexExamples.map((e, i) => (
                  <div
                    key={i}
                    className="px-1 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      setRuleForm({ ...ruleForm, regexFilter: e.content });
                    }}
                  >
                    <span className="font-medium text-muted-foreground">
                      {e.title}
                    </span>{" "}
                    {e.content}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SettnigMenu>
  );
}

// function SettnigMenu({
//   name,
//   children,
// }: {
//   name: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="text-md">
//         <div className="flex gap-1 items-center">
//           <ChevronRight className="w-4 h-4" />
//           <div className="font-semibold">{name}</div>
//         </div>
//       </div>

//       {children}
//     </div>
//   );
// }
