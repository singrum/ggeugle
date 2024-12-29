import Moremi from "@/assets/moremi.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMenu } from "@/lib/store/useMenu";
import { manners, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { cates, changeables, dicts, poses, sampleRules } from "@/lib/wc/rules";
import { isEqual } from "lodash";
import { ChevronDown, CircleHelp, HelpCircle } from "lucide-react";
import React, { Fragment, ReactNode, useState } from "react";
import { FileDropZone } from "./FileDropZone";
import { SettingMenu } from "./SettingMenu";

const ruleGroup: { name: string; children: ReactNode[] }[] = [
  {
    name: "단어",
    children: [
      <DictSetting />,

      <PosSetting />,
      <CateSetting />,
      <RegexFilterSetting />,
      // <HeadTailDuplicationSetting />,
    ],
  },
  {
    name: "연결 규칙",
    children: [<ChanSetting />, <HeadIdxSetting />, <TailIdxSetting />],
  },
  {
    name: "후처리",
    children: [
      <AddedWords1Setting />,

      <MannerSetting />,
      <AddedWords2Setting />,
    ],
  },
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
      <div className="flex flex-col min-w-0 py-4 pt-8 px-0 pb-2 md:p-0">
        <div className="flex gap-4 items-center mb-2 justify-between md:justify-start px-6 md:px-2">
          <div className="font-semibold mb-2">빠른 설정</div>
        </div>

        <ScrollArea className="w-full pb-4 md:pb-6">
          <div className="flex w-full min-w-0 gap-2 whitespace-nowrap px-4 md:p-0">
            <KkutuRuleSelectBtn />
            {sampleRules.map(({ name, ruleForm, desc }) => (
              <Fragment key={name}>
                <Button
                  size="sm"
                  className={cn("gap-2 pr-0")}
                  variant="secondary"
                  onClick={() => {
                    setRuleForm(ruleForm);
                    updateRule();
                    setMenu(0);
                  }}
                >
                  <div>{name}</div>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="text-muted-foreground h-full transition-colors hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="h-full flex items-center justify-center pr-2">
                        <CircleHelp className="w-4 h-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[270px] text-sm">
                      {desc}
                    </PopoverContent>
                  </Popover>
                </Button>
              </Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator className="hidden md:block mb-4" />
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row md:min-h-0 pt-4 w-[1000px] max-w-screen-lg">
          <div className="md:w-[150px] lg:w-[200px] flex gap-4 md:gap-1 flex-row md:flex-col shadow-[inset_0_-1px_0_0_hsl(var(--border))] md:shadow-none px-6 md:px-0 h-full">
            {ruleGroup.map(({ name }, i) => (
              <div className="flex items-center" key={i}>
                <div
                  key={i}
                  className={cn(
                    "text-base text-muted-foreground md:text-foreground cursor-pointer py-2 md:p-2 md:pb-0 md:py-1 md:rounded-md flex-1 border-b-2 border-transparent select-none font-medium md:font-normal md:border-b-0 lg:hover:bg-accent transition-colors ",
                    {
                      "text-foreground border-foreground md:bg-accent font-medium":
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

          <div className="flex flex-col md:flex-1 px-6 py-2 md:py-0 min-w-0">
            {ruleGroup[ruleGroupMenu].children.map((e, i) => (
              <Fragment key={i}>
                {e}

                <Separator className="my-2" />
              </Fragment>
            ))}
          </div>
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
  const [ruleForm, setRuleForm] = useWC((e) => [e.ruleForm, e.setRuleForm]);

  return (
    <SettingMenu name="사전" className="md:pt-0">
      <Select
        value={
          typeof ruleForm.dict === "object" ? "file" : ruleForm.dict.toString()
        }
        onValueChange={(e) => {
          if (e === "file") {
            setRuleForm({ ...ruleForm, dict: { uploadedDict: "" } });
          } else {
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
          }
        }}
      >
        <SelectTrigger className="w-[180px]">{<SelectValue />}</SelectTrigger>
        <SelectContent>
          {dicts.map(({ name }, i) => (
            <SelectItem className="text-xs" value={`${i}`} key={i}>
              <div className="flex gap-1">{name}</div>
            </SelectItem>
          ))}
          <Separator />
          <SelectItem className="text-xs" value={`file`}>
            <div className="flex gap-1">직접 입력</div>
          </SelectItem>
        </SelectContent>
      </Select>

      {typeof ruleForm.dict == "object" ? (
        <FileDropZone />
      ) : (
        <div>
          <Alert>
            <HelpCircle className="h-5 w-5" />
            <AlertTitle>{dicts[ruleForm.dict].name}</AlertTitle>
            <AlertDescription>{dicts[ruleForm.dict].desc}</AlertDescription>
          </Alert>
        </div>
      )}
    </SettingMenu>
  );
}

function PosSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);

  return (
    <SettingMenu name="품사">
      <div className="flex flex-wrap gap-1">
        {poses.map((e, i) => (
          <React.Fragment key={i}>
            <button
              className={cn(
                "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer bg-background",
                {
                  "bg-foreground text-background hover:bg-foreground hover:text-background":
                    ruleForm.pos[i],
                  "opacity-50 cursor-not-allowed hover:bg-background hover:text-muted-foreground":
                    (ruleForm.dict === 3 && i === 7) ||
                    ((ruleForm.dict === 2 || ruleForm.dict === 3) && i === 8) ||
                    ruleForm.dict === 4 ||
                    ruleForm.dict === 5 ||
                    typeof ruleForm.dict === "object",
                }
              )}
              onClick={() => {
                if (
                  !(
                    (ruleForm.dict === 3 && i === 7) ||
                    ((ruleForm.dict === 2 || ruleForm.dict === 3) && i === 8) ||
                    ruleForm.dict === 4 ||
                    ruleForm.dict === 5 ||
                    typeof ruleForm.dict === "object"
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
            </button>
          </React.Fragment>
        ))}
      </div>
    </SettingMenu>
  );
}

function CateSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu name="범주" description="우리말샘일 때만 설정 가능">
      <div>
        <div className="flex flex-wrap gap-1">
          {cates.map((e, i) => (
            <React.Fragment key={i}>
              <button
                className={cn(
                  "transition-colors rounded-full border-border border py-1 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer ",
                  {
                    "bg-foreground text-background hover:bg-foreground hover:text-background":
                      ruleForm.cate[i],
                    "opacity-50 cursor-not-allowed ":
                      ruleForm.dict === 0 ||
                      ruleForm.dict === 1 ||
                      ruleForm.dict === 3 ||
                      ruleForm.dict === 4 ||
                      ruleForm.dict === 5 ||
                      typeof ruleForm.dict === "object",
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
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </SettingMenu>
  );
}

function HeadTailDuplicationSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <>
      <SettingMenu
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
          <Label htmlFor="remove_head_tail_duplication">적용</Label>
        </div>
      </SettingMenu>
    </>
  );
}

function ChanSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu name="두음 법칙" className="md:pt-0">
      <Select
        value={ruleForm.chan.toString()}
        onValueChange={(e) => setRuleForm({ ...ruleForm, chan: parseInt(e) })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {changeables.map(({ name }, i) => (
            <SelectItem className="text-xs" value={`${i}`} key={i}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {ruleForm.chan !== 0 && (
        <Alert className="max-w-[500px]">
          <HelpCircle className="h-5 w-5" />
          <AlertTitle>{changeables[ruleForm.chan].name}</AlertTitle>
          <AlertDescription
            className={cn({
              "!px-0 md:!px-4":
                ruleForm.chan === 1 ||
                ruleForm.chan === 3 ||
                ruleForm.chan === 5 ||
                ruleForm.chan === 6 ||
                ruleForm.chan === 7,
            })}
          >
            {
              [
                <></>,
                <div>
                  <div className="!pl-7 md:!pl-3">
                    받침에 상관없이 아래와 같이 변환됩니다.
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">음절</TableHead>
                          <TableHead className="text-right">
                            변환 가능
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            랴, 려, 료, 류, 리, 례
                          </TableCell>

                          <TableCell className="text-right">
                            야, 여, 요, 유, 이, 예
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            라, 래, 로, 루, 르, 뢰
                          </TableCell>

                          <TableCell className="text-right">
                            나, 내, 노, 누, 느, 뇌
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            녀, 뇨, 뉴, 니
                          </TableCell>

                          <TableCell className="text-right">
                            여, 요, 유, 이
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>,
                <div>
                  <span className="font-medium">표준두음법칙</span>으로 바꿀 수
                  있는 경우, 반드시 그렇게 바꿔야합니다.
                </div>,
                <div>
                  <div className="!pl-7 md:!pl-3">
                    받침에 상관없이 아래와 같이 변환됩니다.
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">음절</TableHead>
                          <TableHead className="text-right">
                            변환 가능
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            야, 여, 요, 유, 이, 예
                          </TableCell>

                          <TableCell className="text-right">
                            랴, 려, 료, 류, 리, 례
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            나, 내, 노, 누, 느, 뇌
                          </TableCell>

                          <TableCell className="text-right">
                            라, 래, 로, 루, 르, 뢰
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            여, 요, 유, 이
                          </TableCell>

                          <TableCell className="text-right">
                            녀, 뇨, 뉴, 니
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>,
                <div>
                  <span className="font-medium">역표준두음법칙</span>으로 바꿀
                  수 있는 경우, 반드시 그렇게 바꿔야합니다.
                </div>,
                <div>
                  <div className="!pl-7 md:!pl-3">
                    중성, 종성에 상관없이 아래와 같이 변환됩니다.
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">초성</TableHead>
                          <TableHead className="text-right">
                            변환 가능
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">ㄹ</TableCell>

                          <TableCell className="text-right">ㄴ, ㅇ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㄴ</TableCell>

                          <TableCell className="text-right">ㅇ</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>,
                <div>
                  <div className="!pl-7 md:!pl-3">
                    중성, 종성에 상관없이 아래와 같이 변환됩니다.
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">초성</TableHead>
                          <TableHead className="text-right">
                            변환 가능
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">ㄹ</TableCell>

                          <TableCell className="text-right">ㄴ, ㅇ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㄴ</TableCell>

                          <TableCell className="text-right">ㄹ, ㅇ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅇ</TableCell>

                          <TableCell className="text-right">ㄹ, ㄴ</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>,
                <div>
                  <div className="!pl-7 md:!pl-3">
                    초성, 종성에 상관없이 아래와 같이 변환됩니다.
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">중성</TableHead>
                          <TableHead className="text-right">
                            변환 가능
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">ㅏ</TableCell>

                          <TableCell className="text-right">ㅓ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅑ</TableCell>

                          <TableCell className="text-right">ㅕ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅓ</TableCell>

                          <TableCell className="text-right">ㅏ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅕ</TableCell>

                          <TableCell className="text-right">ㅑ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅗ</TableCell>

                          <TableCell className="text-right">ㅜ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅛ</TableCell>

                          <TableCell className="text-right">ㅠ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅜ</TableCell>

                          <TableCell className="text-right">ㅗ</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ㅠ</TableCell>

                          <TableCell className="text-right">ㅛ</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>,
                <div>
                  <p className="">초성과 종성의 위치를 바꿀 수 있습니다.</p>
                  <p className="text-muted-foreground">예시) 글 ↔ 륵</p>
                </div>,
                <div>
                  <p className="">
                    초성과 종성에 대하여 자유두음법칙을 적용합니다.
                  </p>
                  <p className="text-muted-foreground">
                    예시) 능 → 릉, 능, 늘, 는
                  </p>
                </div>,
              ][ruleForm.chan]
            }
          </AlertDescription>
        </Alert>
      )}
    </SettingMenu>
  );
}

function HeadIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu name="첫 글자">
      <div className="flex gap-2 items-center">
        <Select
          value={ruleForm.headDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, headDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-[100px]">
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
          className="w-20"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, headIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1">번째 글자</div>
      </div>
    </SettingMenu>
  );
}

function TailIdxSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu name="끝 글자">
      <div className="flex gap-2 items-center">
        <Select
          value={ruleForm.tailDir.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, tailDir: parseInt(e) as 0 | 1 })
          }
        >
          <SelectTrigger className="w-[100px]">
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
          className="w-20"
          onChange={(e) =>
            setRuleForm({ ...ruleForm, tailIdx: parseInt(e.target.value) })
          }
        />
        <div className="flex-1 ">번째 글자</div>
      </div>
    </SettingMenu>
  );
}

function MannerSetting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu name="한방단어 제거">
      <div className="flex flex-col gap-2">
        <Select
          value={ruleForm.manner.toString()}
          onValueChange={(e) =>
            setRuleForm({ ...ruleForm, manner: parseInt(e) })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {manners.map((e, i) => (
              <SelectItem className="text-xs" value={`${i}`} key={i}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm">
          {ruleForm.manner === 1 && (
            <>
              <Alert>
                <HelpCircle className="h-5 w-5" />
                <AlertTitle>한 번만 제거</AlertTitle>
                <AlertDescription>
                  <div>
                    한방단어를 한 번만 제거합니다.
                    <span className="text-muted-foreground">
                      {` `}(끄투의 매너 규칙과 동일)
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            </>
          )}

          {ruleForm.manner === 2 && (
            <>
              <Alert>
                <HelpCircle className="h-5 w-5" />
                <AlertTitle>모두 제거</AlertTitle>
                <AlertDescription>
                  한방단어를 제거함으로 인해 생기는 한방단어까지 모두
                  제거합니다.
                  <span className="text-muted-foreground">
                    {` `}(노룰, 천도룰에 적용)
                  </span>
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </div>
    </SettingMenu>
  );
}

function AddedWords1Setting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu
      className="md:pt-0"
      name="단어 추가 (1차)"
      description={
        <>
          <p>이 단어들은 한방단어 제거 옵션에 의해 제거될 수 있습니다.</p>
          <p>여러 개의 단어 입력 시 공백으로 구분합니다.</p>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          value={ruleForm.addedWords1}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, addedWords1: e.target.value })
          }
        />
      </div>
    </SettingMenu>
  );
}
function AddedWords2Setting() {
  const ruleForm = useWC((e) => e.ruleForm);
  const setRuleForm = useWC((e) => e.setRuleForm);
  return (
    <SettingMenu
      name="단어 추가 (2차)"
      description={
        <>
          <p>이 단어들은 한방단어 제거 옵션에 의해 제거되지 않습니다.</p>
          <p>여러 개의 단어 입력 시 공백으로 구분합니다.</p>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          value={ruleForm.addedWords2}
          onChange={(e) =>
            setRuleForm({ ...ruleForm, addedWords2: e.target.value })
          }
        />
      </div>
    </SettingMenu>
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
    title: "3글자 단어",
    content: String.raw`(.{3})`,
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
    <SettingMenu name="단어 필터" description="Regex로 작성">
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
            <AccordionTrigger className="text-sm px-1 pt-4 pb-2 font-normal">
              예시
            </AccordionTrigger>
            <AccordionContent className="font-semibold px-1 py-2">
              <div className="flex flex-col gap-2">
                {RegexExamples.map((e, i) => (
                  <div
                    key={i}
                    className=" hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      setRuleForm({ ...ruleForm, regexFilter: e.content });
                    }}
                  >
                    <span className="font-medium">{e.title}</span>{" "}
                    <span className="font-normal text-muted-foreground">
                      {e.content}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SettingMenu>
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
        <Button size="sm" className="px-2 gap-2" variant="secondary">
          {/* <div className="flex gap-2 w-fit items-center"> */}
          <div className="flex gap-1 items-center ">
            <div className="w-5 h-5">
              <img src={Moremi} className="w-5 h-5" />
            </div>
            끄투코리아
          </div>
          <div className="w-4">
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>끄투코리아 룰 설정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="grid grid-cols-2 mb-2 gap-y-4">
            <div className="text-sm pt-2 font-medium">게임 유형</div>
            <Select
              value={gameType.toString()}
              onValueChange={(val) => setGameType(parseInt(val))}
            >
              <SelectTrigger className="text-xs w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kkutuInfo.gameType.map((e, i) => (
                  <SelectItem value={i.toString()} key={e} className="text-xs">
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm font-medium">특수 규칙</div>

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
                manner: !manner ? 0 : 1,
                regexFilter:
                  gameType === 1
                    ? "(.{3})"
                    : gameType === 0 && manner && !injeong
                    ? "(?!(껏구리)$).*"
                    : ".*",
                addedWords1: "",
                addedWords2: "",
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
