import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { changeableMap, reverseChangeableMap } from "@/lib/wc/hangul";
import {
  CharSearchResult,
  NoncharSearchResult,
  WCDisplay,
  WordType,
} from "@/lib/wc/wordChain";
import { josa } from "es-hangul";
import { CircleHelp } from "lucide-react";
import React, { useState } from "react";
import Analysis from "./Analysis";
import SolutionTree from "./SolutionTree";

export default function SearchResult() {
  return (
    <div className="">
      <WordsResult />
      <div className="h-[50vh]" />
    </div>
  );
}

const tabInfo = [
  { name: "~로 시작하는" },
  { name: "~로 끝나는" },
  { name: "탐색" },
  { name: "두음법칙" },
];

function WordsResult() {
  const [searchResult, engine, searchInputValue] = useWC((e) => [
    e.searchResult,
    e.engine,
    e.searchInputValue,
    e.setValue,
  ]);
  const [tab, setTab] = useState<number>(0);
  return (
    <>
      <div className="border-b px-4 flex bg-background whitespace-nowrap overflow-auto">
        {tabInfo.map(({ name }, i) => (
          <div
            key={i}
            className={cn(
              "text-muted-foreground cursor-pointer transition-colors border-b-2 border-transparent py-2 text-sm px-2 md:px-3",
              {
                "text-foreground font-semibold border-primary": tab === i,
              }
            )}
            onClick={() => setTab(i)}
          >
            {name}
          </div>
        ))}
      </div>

      {tab === 0 &&
        (engine ? (
          searchResult && (
            <>
              <div className="flex-1 min-h-0 p-2 md:px-4 md:py-2">
                {searchResult.isChar ? (
                  <>
                    {(searchResult.result as CharSearchResult).startsWith.win
                      .length > 0 &&
                      (
                        searchResult.result as CharSearchResult
                      ).startsWith.win.map((e, i) => (
                        <React.Fragment key={i}>
                          <WordBox>
                            <WordBadge>{`${e.endNum}턴 후 승리`}</WordBadge>
                            <WordContent
                              wordInfo={e.words.map((word) => ({
                                word,
                                type: "win",
                              }))}
                            />
                          </WordBox>
                          <Separator className="my-2" />
                        </React.Fragment>
                      ))}
                    {(searchResult.result as CharSearchResult).startsWith.wincir
                      .length > 0 &&
                      (searchResult.result as CharSearchResult).startsWith
                        .wincir.length && (
                        <React.Fragment>
                          <WordBox>
                            <WordBadge>{`조건부 승리`}</WordBadge>
                            <WordContent
                              wordInfo={(
                                searchResult.result as CharSearchResult
                              ).startsWith.wincir.map((word) => ({
                                word,
                                type: "win",
                              }))}
                            />
                          </WordBox>
                          <Separator className="my-2" />
                        </React.Fragment>
                      )}
                    {(searchResult.result as CharSearchResult).startsWith.route
                      .length > 0 && (
                      <>
                        <WordBox>
                          <WordBadge>{`루트 단어`}</WordBadge>
                          <WordContent
                            wordInfo={
                              (searchResult.result as CharSearchResult)
                                .startsWith.route
                                ? (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.route.map((word) => ({
                                    word,
                                    type: "route",
                                  }))
                                : []
                            }
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </>
                    )}
                    {(searchResult.result as CharSearchResult).startsWith.return
                      .length > 0 && (
                      <>
                        <WordBox>
                          <Popover>
                            <PopoverTrigger>
                              <WordBadge>
                                {`되돌림 단어`}
                                <CircleHelp className="w-4 h-4" />
                              </WordBadge>
                            </PopoverTrigger>
                            <PopoverContent className="text-sm">
                              되돌림 단어들의 유무는 승패 여부에 영향을 주지
                              않습니다.
                            </PopoverContent>
                          </Popover>
                          <WordContent
                            wordInfo={
                              (searchResult.result as CharSearchResult)
                                .startsWith.return
                                ? (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.return.map((word) => ({
                                    word,
                                    type: "muted-foreground",
                                    returning: true,
                                  }))
                                : []
                            }
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </>
                    )}

                    {(searchResult.result as CharSearchResult).startsWith.loscir
                      .length > 0 && (
                      <>
                        <WordBox>
                          <WordBadge>{`조건부 패배`}</WordBadge>
                          <WordContent
                            wordInfo={
                              (searchResult.result as CharSearchResult)
                                .startsWith.loscir
                                ? (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.loscir.map((word) => ({
                                    word,
                                    type: "los",
                                  }))
                                : []
                            }
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </>
                    )}
                    {(searchResult.result as CharSearchResult).startsWith.los
                      .length > 0 &&
                      (
                        searchResult.result as CharSearchResult
                      ).startsWith.los.map((e, i) => (
                        <React.Fragment key={i}>
                          <WordBox>
                            <WordBadge>{`${e.endNum}턴 후 패배`}</WordBadge>
                            <WordContent
                              wordInfo={e.words.map((word) => ({
                                word,
                                type: "los",
                              }))}
                            />
                          </WordBox>
                          <Separator className="my-2" />
                        </React.Fragment>
                      ))}
                  </>
                ) : (
                  (searchResult.result as NoncharSearchResult).startsWith
                    .length > 0 && (
                    <>
                      <WordBox>
                        <WordContent
                          wordInfo={(
                            searchResult.result as NoncharSearchResult
                          ).startsWith.map((word) => ({
                            word,
                            type: WCDisplay.reduceWordtype(
                              WCDisplay.getWordType(engine!, word)
                                .type as WordType
                            ),
                          }))}
                        />
                      </WordBox>
                      <Separator className="my-2" />
                    </>
                  )
                )}
              </div>
            </>
          )
        ) : (
          <div className="flex-1 min-h-0">
            <>
              <WordBox>
                <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
                  {Array(100)
                    .fill(0)
                    .map((_, i) =>
                      Math.random() < 0.5 ? (
                        <Skeleton
                          className="py-1 px-3 text-transparent rounded-full text-sm"
                          key={i}
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Skeleton>
                      ) : (
                        <Skeleton
                          className="py-1 px-3 text-transparent rounded-full text-sm"
                          key={i}
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Skeleton>
                      )
                    )}
                </div>
              </WordBox>
              <Separator className="my-2" />
            </>
          </div>
        ))}

      {/* 끝나는 */}

      {tab === 1 &&
        (engine ? (
          searchResult && (
            <>
              <div className="flex-1 min-h-0 p-2 md:px-4 md:py-2">
                {searchResult.isChar === true ? (
                  <>
                    {(searchResult.result as CharSearchResult).endsWith.head_los
                      .length > 0 && (
                      <React.Fragment>
                        <WordBox>
                          <WordContent
                            wordInfo={(
                              searchResult.result as CharSearchResult
                            ).endsWith.head_los.map((word) => ({
                              word,
                              type: WCDisplay.reduceWordtype(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                            endsWith={true}
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </React.Fragment>
                    )}
                    {(searchResult.result as CharSearchResult).endsWith
                      .head_route.length > 0 && (
                      <React.Fragment>
                        <WordBox>
                          {/* <WordBadge>{``}</WordBadge> */}
                          <WordContent
                            wordInfo={(
                              searchResult.result as CharSearchResult
                            ).endsWith.head_route.map((word) => ({
                              word,
                              type: WCDisplay.reduceWordtype(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                            endsWith={true}
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </React.Fragment>
                    )}
                    {(searchResult.result as CharSearchResult).endsWith.rest
                      .length > 0 && (
                      <>
                        <WordBox>
                          <WordContent
                            wordInfo={(
                              searchResult.result as CharSearchResult
                            ).endsWith.rest.map((word) => ({
                              word,
                              type: WCDisplay.reduceWordtype(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </>
                    )}
                  </>
                ) : (
                  (searchResult.result as NoncharSearchResult).endsWith.length >
                    0 && (
                    <>
                      <WordBox>
                        <WordContent
                          wordInfo={(
                            searchResult.result as NoncharSearchResult
                          ).endsWith.map((word) => ({
                            word,
                            type: WCDisplay.reduceWordtype(
                              WCDisplay.getWordType(engine!, word)
                                .type as WordType
                            ),
                          }))}
                        />
                      </WordBox>
                      <Separator className="my-2" />
                    </>
                  )
                )}
              </div>
            </>
          )
        ) : (
          <div className="flex-1 min-h-0">
            <>
              <WordBox>
                <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
                  {Array(100)
                    .fill(0)
                    .map((_, i) =>
                      Math.random() < 0.5 ? (
                        <Skeleton
                          className="py-1 px-3 text-transparent rounded-full text-sm"
                          key={i}
                        >
                          싱그럼
                        </Skeleton>
                      ) : (
                        <Skeleton
                          className="py-1 px-3 text-transparent rounded-full text-sm"
                          key={i}
                        >
                          끄글
                        </Skeleton>
                      )
                    )}
                </div>
              </WordBox>
              <Separator className="my-2" />
            </>
          </div>
        ))}

      {tab === 2 && engine && (
        <div className="p-2 md:p-4">
          {engine.chanGraph.nodes[searchInputValue]?.type === "route" ? (
            <Analysis />
          ) : (
            (engine.chanGraph.nodes[searchInputValue]?.type === "win" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "los" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "wincir" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "loscir") && (
              <SolutionTree />
            )
          )}
        </div>
      )}
      {tab === 3 && engine && searchInputValue.length === 1 && (
        <div className="flex-1 min-h-0 p-2 md:px-4 md:py-2">
          <WordBox>
            <WordBadge>{`${searchInputValue}에서 변환 가능한 글자`}</WordBadge>
            <WordContent
              wordInfo={changeableMap[engine.rule.changeableIdx](
                searchInputValue
              ).map((char) => ({
                word: char,
                type: engine.wordGraph.nodes[char]
                  ? WCDisplay.reduceWordtype(
                      engine.wordGraph.nodes[char].type as WordType
                    )
                  : "los",
              }))}
            />
          </WordBox>
          <Separator className="my-2" />
          <WordBox>
            <WordBadge>{`${josa(
              searchInputValue,
              "으로/로"
            )} 변환 가능한 글자`}</WordBadge>
            <WordContent
              wordInfo={reverseChangeableMap[engine.rule.changeableIdx](
                searchInputValue
              ).map((char) => ({
                word: char,
                type: engine.wordGraph.nodes[char]
                  ? (WCDisplay.reduceWordtype(
                      engine.chanGraph.nodes[char].type as WordType
                    ) as "win" | "los" | "route")
                  : WCDisplay.getCharType(engine, char),
              }))}
            />
          </WordBox>
        </div>
      )}
    </>
  );
}
