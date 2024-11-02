import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMenu } from "@/lib/store/useMenu";
import { cates, dicts, poses, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { sampleRules } from "@/lib/wc/rules";
import { isEqual } from "lodash";
import { ChevronDown } from "lucide-react";
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
      <HeadTailDuplicationSetting />,
    ],
  },
  {
    name: "연결 규칙",
    children: [<ChanSetting />, <HeadIdxSetting />, <TailIdxSetting />],
  },
  { name: "후처리", children: [<AddedWordsSetting />, <MannerSetting />] },
];

export function RuleSetting() {
  const [rule, ruleForm, setRuleForm, updateRule] = useWC((state) => [
    state.rule,
    state.ruleForm,
    state.setRuleForm,
    state.updateRule,
  ]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const setMenu = useMenu((state) => state.setMenu);
  const [ruleGroupMenu, setRuleGroupMenu] = useState<number>(0);
  const isChanged = !isEqual(rule, ruleForm);

  return (
    <div className="flex flex-col min-w-0 mb-[200px] relative w-full max-w-full">
      <div className="flex flex-col min-w-0 p-4 pb-0 md:border border-border md:rounded-xl ">
        <div className="flex gap-4 items-center mb-4 justify-between md:justify-start">
          <div className="font-semibold">바로가기</div>
        </div>

        <ScrollArea className="w-full pb-4">
          <div className="flex w-full min-w-0 gap-2 whitespace-nowrap ">
            <KkutuRuleSelectBtn />
            {sampleRules.map(({ name, ruleForm }) => (
              <Fragment key={name}>
                <Button
                  size="sm"
                  className={cn("gap-1")}
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
      <div className="flex flex-col md:flex-row md:min-h-0 pt-4">
        <div className="md:w-[200px] flex gap-4 md:gap-1 flex-row md:flex-col shadow-[inset_0_-1px_0_0_hsl(var(--border))] md:shadow-none px-6 md:px-0 h-full">
          {ruleGroup.map(({ name }, i) => (
            <div className="flex items-center" key={i}>
              <div
                key={i}
                className={cn(
                  "text-base text-muted-foreground md:text-foreground cursor-pointer py-2 md:p-2 md:pb-0 md:py-1 md:rounded-md flex-1 border-b-2 border-transparent select-none  md:border-b-0",
                  {
                    "transition-colors text-foreground border-foreground md:bg-accent":
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

        <div className="flex flex-col md:flex-1 px-6 py-2 md:py-0">
          {ruleGroup[ruleGroupMenu].children.map((e, i) => (
            <Fragment key={i}>
              {e}
              <Separator />
            </Fragment>
          ))}
        </div>
      </div>
      {isChanged && (
        <div
          className="flex justify-center fixed bottom-14 md:bottom-4 transition-opacity p-2 w-full"
          style={{ maxWidth: "inherit" }}
        >
          <div className="border border-border rounded-lg flex p-2 bg-background items-center w-full md:w-auto md:min-w-[500px] justify-between shadow">
            <div className="flex items-center">
              {/* <CircleAlert className="w-4 h-4" /> */}
              <div className="mx-2 text-sm md:text-base">
                변경 사항이 있습니다.
              </div>
            </div>
            <div className="flex">
              <Button
                className="text-foreground"
                size={isDesktop ? "default" : "sm"}
                variant={"link"}
                onClick={() => {
                  setRuleForm({ ...rule });
                }}
              >
                되돌리기
              </Button>

              <Button
                size={isDesktop ? "default" : "sm"}
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
      )}
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
                pos: { ...ruleForm.pos, "8": false },
              });
              break;
            case 2:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                pos: { ...ruleForm.pos, "8": false },
              });
              break;
            case 3:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, true, true, true],
                pos: { ...ruleForm.pos, "7": false, "8": false },
              });
              break;
            case 4:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, true, true, true],
                pos: [true, true, true, true, true, true, true, true, true],
              });
              break;
            case 5:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, true, true, true],
                pos: [true, true, true, true, true, true, true, true, true],
              });
              break;
            case 6:
              setRuleForm({
                ...ruleForm,
                dict: parseInt(e),
                cate: [true, true, true, true],
                pos: [true, true, true, true, true, true, true, true, true],
              });
              break;
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dicts.map((dict, i) => (
            <SelectItem className="text-xs" value={`${i}`} key={i}>
              <div className="flex gap-1">
                {dict}
                {/* {(i === 4 || i === 5) && (
                  <div className=" rounded-md bg-[#F3D368]  px-1.5 py-0.5 text-xs leading-none text-black font-semibold no-underline group-hover:no-underline">
                    New
                  </div>
                )} */}
              </div>
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
                  "opacity-50":
                    (ruleForm.dict === 3 && i === 7) ||
                    ((ruleForm.dict === 1 ||
                      ruleForm.dict === 2 ||
                      ruleForm.dict === 3) &&
                      i === 8) ||
                    ruleForm.dict === 4 ||
                    ruleForm.dict === 5 ||
                    ruleForm.dict === 6,
                }
              )}
              onClick={() => {
                if (
                  !(
                    (ruleForm.dict === 3 && i === 7) ||
                    ((ruleForm.dict === 1 ||
                      ruleForm.dict === 2 ||
                      ruleForm.dict === 3) &&
                      i === 8) ||
                    ruleForm.dict === 4 ||
                    ruleForm.dict === 5 ||
                    ruleForm.dict === 6
                  )
                ) {
                  setRuleForm({
                    ...ruleForm,
                    pos: { ...ruleForm.pos, [i]: !ruleForm.pos[i] },
                  });
                }
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
    <SettnigMenu name="범주" description="우리말샘일 때만 설정 가능">
      <div>
        <div className="flex flex-wrap gap-1">
          {cates.map((e, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer ",
                  {
                    "bg-foreground text-background hover:bg-foreground hover:text-background":
                      ruleForm.cate[i],
                    "opacity-50":
                      ruleForm.dict === 0 ||
                      ruleForm.dict === 1 ||
                      ruleForm.dict === 3 ||
                      ruleForm.dict === 4 ||
                      ruleForm.dict === 5 ||
                      ruleForm.dict === 6,
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

function HeadTailDuplicationSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <>
      <SettnigMenu
        name="첫 글자, 끝 글자 중복 제거"
        description="글자 a에서 글자 b로 끝나는 단어가 여러 개이면 하나만 남기고 삭제합니다."
      >
        <div className="flex items-center space-x-2 px-1">
          <Checkbox
            id="remove_head_tail_duplication"
            checked={ruleForm.removeHeadTailDuplication}
            onCheckedChange={(e: boolean) => {
              setRuleForm({ ...ruleForm, removeHeadTailDuplication: e });
            }}
          />
          <Label htmlFor="manner">적용</Label>
        </div>
      </SettnigMenu>
    </>
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
        <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-fit">
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
          <SelectTrigger className="">
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
        <Label htmlFor="manner">적용</Label>
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
        <Label htmlFor="picture">
          직접 입력{` `}
          <span className="text-muted-foreground">(띄어쓰기로 구분)</span>
        </Label>
        <Input
          value={ruleForm.addedWords}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, addedWords: e.target.value })
          }
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">
          파일로 입력 {` `}
          <span className="text-muted-foreground">
            (띄어쓰기 및 공백으로 구분)
          </span>
        </Label>
        <Input
          id="picture"
          type="file"
          disabled
          onChange={(e) => {
            console.log(e);
          }}
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
    content: String.raw`[^가나].*`,
  },
  {
    title: "'가'로 끝나지 않는 단어",
    content: String.raw`.*[^가]`,
  },
  {
    title: "'가'와 '나'로 끝나지 않는 단어",
    content: String.raw`.*[^가나]`,
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
    content: String.raw`[^가]*`,
  },
  {
    title: "'가'와 '나'를 포함하지 않는 단어",
    content: String.raw`[^가나]*`,
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
    <SettnigMenu name="단어 필터" description="Regex로 작성">
      <div>
        <div className="flex flex-col gap-2">
          <Input
            value={ruleForm.regexFilter}
            onChange={(e) =>
              setRuleForm({ ...ruleForm, regexFilter: e.target.value })
            }
          />
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-sm px-1 pt-4 pb-2">
              예시
            </AccordionTrigger>
            <AccordionContent className="font-semibold px-1">
              <div className="flex flex-col gap-2">
                {RegexExamples.map((e, i) => (
                  <div
                    key={i}
                    className=" hover:bg-accent cursor-pointer transition-colors"
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

const kkutuInfo = { gameType: ["끝말잇기", "쿵쿵따", "앞말잇기"] };

function KkutuRuleSelectBtn() {
  const [setRuleForm, updateRule] = useWC((e) => [e.setRuleForm, e.updateRule]);
  const setMenu = useMenu((e) => e.setMenu);
  const [gameType, setGameType] = useState<number>(0);
  const [manner, setManner] = useState<boolean>(false);
  const [injeong, setInjeong] = useState<boolean>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:ring-offset-1 focus-visible:ring-0"
      >
        <Button size="sm" className="pr-2 gap-2" variant="secondary">
          끄투코리아
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>끄투코리아 룰 설정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="grid grid-cols-2 mb-2 gap-y-4">
            <div className="text-sm pt-2">게임 유형</div>
            <Select
              value={gameType.toString()}
              onValueChange={(val) => setGameType(parseInt(val))}
            >
              <SelectTrigger className="text-xs w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kkutuInfo.gameType.map((e, i) => (
                  <SelectItem value={i.toString()} key={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm">특수 규칙</div>

            <div className="flex flex-col gap-2 mb-2">
              <div className="flex w-full">
                <Checkbox
                  id="kkutu-manner"
                  checked={manner}
                  onCheckedChange={(e) => setManner(e as boolean)}
                />
                <Label htmlFor="kkutu-manner" className="flex-1 ml-2">
                  매너
                </Label>
              </div>
              <div className="flex w-full">
                <Checkbox
                  id="kkutu-injeong"
                  checked={injeong}
                  onCheckedChange={(e) => setInjeong(e as boolean)}
                />
                <Label htmlFor="kkutu-injeong" className="flex-1 ml-2">
                  어인정
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button
            className="w-full"
            onClick={() => {
              setRuleForm({
                dict: injeong ? 5 : 4,
                pos: Object.assign({}, [
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                ]),
                cate: Object.assign({}, [true, true, true, true]),
                chan: 1,
                headDir: gameType === 2 ? 1 : 0,
                headIdx: 1,
                tailDir: gameType === 2 ? 0 : 1,
                tailIdx: 1,
                manner: manner,
                regexFilter:
                  gameType === 1
                    ? "(.{3})"
                    : gameType === 0 && manner && !injeong
                    ? "(?!(껏구리)$).*"
                    : ".*",
                addedWords: "",
                removeHeadTailDuplication: false,
              });
              updateRule();
              setMenu(0);
            }}
          >
            저장
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
