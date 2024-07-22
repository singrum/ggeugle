import { MenuBtn } from "@/App";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cates, dicts, poses, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings2 } from "lucide-react";
import React from "react";
export function RuleSetting() {
  const [rule, setRuleForm, updateRule] = useWC((state) => [
    state.rule,
    state.setRuleForm,
    state.updateRule,
  ]);

  return (
    <div></div>
    // <Dialog
    //   onOpenChange={(e) => {
    //     if (e) {
    //       setRuleForm({ ...rule });
    //     }
    //   }}
    // >
    //   <DialogTrigger>
    //     <MenuBtn icon={<Settings2 strokeWidth={1.5} />} name={"룰 변경"} />
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px] max-h-[80%] overflow-auto scrollbar-thin">
    //     <DialogHeader>
    //       <DialogTitle>룰 변경</DialogTitle>
    //     </DialogHeader>
    //     <DialogDescription>끝말잇기 룰 변경</DialogDescription>
    //     <div className="flex flex-col">
    //       <DictSetting />
    //       <Separator className="my-2" />
    //       <PosSetting />
    //       <Separator className="my-2" />
    //       <CateSetting />
    //       <Separator className="my-2" />
    //       <ChanSetting />
    //       <Separator className="my-2" />
    //       <HeadIdxSetting />
    //       <Separator className="my-2" />
    //       <TailIdxSetting />
    //       <Separator className="my-2" />
    //       <MannerSetting />
    //       <Separator className="my-2" />
    //       <RegexFilterSetting />
    //       <Separator className="my-2" />
    //       <AddedWordsSetting />
    //       <Separator className="my-2" />
    //     </div>
    //     <DialogFooter>
    //       <DialogClose asChild>
    //         <Button variant="outline">취소</Button>
    //       </DialogClose>
    //       <DialogClose asChild>
    //         <Button
    //           onClick={() => {
    //             updateRule();
    //           }}
    //         >
    //           변경사항 저장
    //         </Button>
    //       </DialogClose>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
}

function DictSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="사전">
      <Select
        defaultValue={ruleForm.dict.toString()}
        onValueChange={(e) =>
          setRuleForm({
            ...ruleForm,
            dict: parseInt(e),
            cate: [true, true, true, true],
          })
        }
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
    </RuleMenu>
  );
}

function PosSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);

  return (
    <RuleMenu name="품사">
      <div className="flex flex-wrap gap-1">
        {poses.map((e, i) => (
          <React.Fragment key={i}>
            <div
              className={cn(
                "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
                {
                  "bg-white text-background hover:bg-foreground hover:text-background":
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
    </RuleMenu>
  );
}

function CateSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="범주">
      <div className="flex flex-wrap gap-1">
        {cates.map((e, i) => (
          <React.Fragment key={i}>
            <div
              className={cn(
                "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
                {
                  "bg-white text-background hover:bg-foreground hover:text-background":
                    ruleForm.cate[i],
                  "bg-muted-foreground/80 cursor-default hover:bg-muted-foreground/80":
                    ruleForm.dict === 0,
                }
              )}
              onClick={() => {
                if (ruleForm.dict === 0) return;

                setRuleForm({
                  ...ruleForm,
                  cate: { ...ruleForm.cate, [i]: !ruleForm.cate[i] },
                });
              }}
            >
              {e}
            </div>
          </React.Fragment>
        ))}
      </div>
    </RuleMenu>
  );
}

function ChanSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="두음법칙">
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
    </RuleMenu>
  );
}

function HeadIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="첫 글자">
      <div className="flex gap-1 items-center">
        <Select
          defaultValue={ruleForm.headDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, headDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
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
          defaultValue={ruleForm.headIdx}
          type="number"
          className="w-20 h-fit text-xs focus-visible:ring-offset-1 focus-visible:ring-1"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, headIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1 text-muted-foreground">번째 글자</div>
      </div>
    </RuleMenu>
  );
}

function TailIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="끝 글자">
      <div className="flex gap-1 items-center">
        <Select
          defaultValue={ruleForm.tailDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, tailDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1">
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
          defaultValue={ruleForm.tailIdx}
          type="number"
          className="w-20 h-fit text-xs focus-visible:ring-offset-1 focus-visible:ring-1"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, tailIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1 text-muted-foreground ">번째 글자</div>
      </div>
    </RuleMenu>
  );
}

function MannerSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="매너">
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
    </RuleMenu>
  );
}

function AddedWordsSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <RuleMenu name="단어 추가">
      <div className="text-muted-foreground text-xs">띄어쓰기로 구분</div>
      <Input
        defaultValue={ruleForm.addedWords}
        onChange={(e) =>
          setRuleForm({ ...ruleForm, addedWords: e.target.value })
        }
      ></Input>
    </RuleMenu>
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
    <RuleMenu name="단어 필터">
      <div>
        <Input
          defaultValue={ruleForm.regexFilter}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, regexFilter: e.target.value })
          }
          value={ruleForm.regexFilter}
        ></Input>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none mx-1">
            <AccordionTrigger className="text-sm">예시</AccordionTrigger>
            <AccordionContent className="font-semibold">
              <div className="flex flex-col gap-2">
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
    </RuleMenu>
  );
}

function RuleMenu({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-md">
        <div className="flex gap-2 items-center">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div>{name}</div>
        </div>
      </div>

      {children}
    </div>
  );
}
