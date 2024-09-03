import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMenu } from "@/lib/store/useMenu";
import { cates, dicts, poses, sampleRules, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import React, { Fragment, ReactNode, useState } from "react";
import { SettnigMenu } from "./SettingMenu";

const ruleGroup: { name: string; children: ReactNode[] }[] = [
  {
    name: "단어",
    children: [
      <DictSetting />,
      <RegexFilterSetting />,
      <PosSetting />,
      <CateSetting />,
    ],
  },
  {
    name: "연결 규칙",
    children: [<ChanSetting />, <HeadIdxSetting />, <TailIdxSetting />],
  },
  { name: "후처리", children: [<AddedWordsSetting />, <MannerSetting />] },
];

export function RuleSetting() {
  const [rule, setRuleForm, updateRule] = useWC((state) => [
    state.rule,
    state.setRuleForm,
    state.updateRule,
  ]);

  const setMenu = useMenu((state) => state.setMenu);
  const [ruleGroupMenu, setRuleGroupMenu] = useState<number>(0);

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex flex-col min-w-0 gap-4 p-4 pb-0 bg-muted/40 md:rounded-xl border-b md:border border-border">
        <div className="font-semibold">바로가기</div>
        <ScrollArea className="w-full pb-4">
          <div className="flex w-full min-w-0 gap-2 whitespace-nowrap ">
            {sampleRules.map(({ name, ruleForm }) => (
              <Fragment key={name}>
                <Button
                  size="sm"
                  className="gap-1"
                  variant="secondary"
                  onClick={() => {
                    setRuleForm(ruleForm);
                    updateRule();
                    setMenu(0);
                  }}
                >
                  {name}
                </Button>
              </Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row min-h-dvh md:min-h-0 pt-4">
        <div className="md:w-[200px] flex gap-4 md:gap-1 flex-row md:flex-col border-b border-border md:border-none px-4 md:px-0 h-full">
          {ruleGroup.map(({ name }, i) => (
            <div className="flex items-center" key={i}>
              <div
                key={i}
                className={cn(
                  "text-base text-muted-foreground cursor-pointer py-2 md:p-2 md:pb-0 md:py-1 md:rounded-md flex-1 border-b border-transparent select-none",
                  {
                    "transition-colors text-foreground md:font-semibold border-foreground md:border-b-0 md:bg-accent":
                      ruleGroupMenu === i,
                  }
                )}
                onClick={() => setRuleGroupMenu(i)}
              >
                {name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-1 px-4">
          {ruleGroup[ruleGroupMenu].children.map((e, i) => (
            <Fragment key={i}>
              {e}
              <Separator />
            </Fragment>
          ))}

          <div className="flex justify-end gap-2 py-2">
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
        value={ruleForm.dict.toString()}
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
                "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer bg-background",
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
        <div className="text-xs text-muted-foreground mb-2">
          우리말샘일 때만 설정 가능
        </div>
        <div className="flex flex-wrap gap-1">
          {cates.map((e, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer ",
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
        value={ruleForm.chan.toString()}
        onValueChange={(e) => setRuleForm({ ...ruleForm, chan: parseInt(e) })}
      >
        <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[
            "없음",
            "표준두음",
            "강제표준두음",
            "역표준두음",
            "강제역표준두음",
            "ㄹ→ㄴ→ㅇ",
            "ㄹ⇄ㄴ⇄ㅇ",
            "모음반전",
            "자음상하반전",
            "초성종성자유두음",
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
          value={ruleForm.headDir.toString()}
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
          value={ruleForm.tailDir.toString()}
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
    <SettnigMenu name="한방단어 제거">
      <div className="flex items-center space-x-2 px-1">
        <Checkbox
          id="manner"
          checked={ruleForm.manner}
          onCheckedChange={(e: boolean) => {
            setRuleForm({ ...ruleForm, manner: e });
          }}
        />
        <label
          htmlFor="manner"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          적용
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
    title: "'가'로 시작하지 않는 단어",
    content: String.raw`[^가].*`,
  },
  {
    title: "'가'또는 '나'로 시작하지 않는 단어",
    content: String.raw`[^가나다].*`,
  },
  {
    title: "'가'로 끝나지 않는 단어",
    content: String.raw`.*[^가나다]`,
  },
  {
    title: "'가'와 '나'로 끝나지 않는 단어",
    content: String.raw`.*[^가나다]`,
  },
  {
    title: "'가'를 포함하는 단어",
    content: String.raw`.*[가].*`,
  },
  {
    title: "'가' 또는 '나'를 포함하는 단어",
    content: String.raw`.*[가나].*`,
  },
  {
    title: "'가'를 포함하지 않는 단어",
    content: String.raw`.*[^가나].*`,
  },
  {
    title: "'가'와 '나'를 포함하지 않는 단어",
    content: String.raw`.*[^가나].*`,
  },
  {
    title: "첫 글자와 끝 글자가 다른 단어",
    content: String.raw`(.).*(?!\1).`,
  },
  {
    title: "2글자 단어",
    content: String.raw`(.{2})`,
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
    title: "ab를 제외한 단어",
    content: String.raw`(?!(ab)$).*`,
  },
  {
    title: "ab, cd, ef를 제외한 단어",
    content: String.raw`(?!(ab|cd|ef)$).*`,
  },
];

function RegexFilterSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);

  return (
    <SettnigMenu name="단어 필터">
      <div>
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs">Regex로 작성</div>
          <Input
            value={ruleForm.regexFilter}
            onChange={(e) =>
              setRuleForm({ ...ruleForm, regexFilter: e.target.value })
            }
          />
        </div>
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
