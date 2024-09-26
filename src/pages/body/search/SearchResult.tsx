import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";

import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { changeableMap, reverseChangeableMap } from "@/lib/wc/changeables";
import {
  CharSearchResult,
  NoncharSearchResult,
  WCDisplay,
  WordType,
} from "@/lib/wc/WordChain";
import { josa } from "es-hangul";
import { ChevronDown, CircleHelp } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  { name: "첫 글자" },
  { name: "끝 글자" },
  { name: "전략 탐색" },
  { name: "두음 법칙" },
];

function WordsResult() {
  const [searchResult, engine, searchInputValue] = useWC((e) => [
    e.searchResult,
    e.engine,
    e.searchInputValue,
  ]);
  const [showAllWords, setShowAllWords] = useCookieSettings((e) => [
    e.showAllWords,
    e.setShowAllWords,
  ]);
  const [tab, setTab] = useState<number>(0);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const charType =
    engine &&
    searchInputValue &&
    WCDisplay.getCharType(engine, searchInputValue);
  useEffect(() => {
    setIsMoreOpen(false);
  }, [searchInputValue]);

  return (
    <>
      <div className="shadow-[inset_0_-1px_0_0_hsl(var(--border))] px-6 flex whitespace-nowrap overflow-auto gap-4">
        {tabInfo.map(({ name }, i) => (
          <div
            key={i}
            className={cn(
              "text-muted-foreground cursor-pointer transition-colors border-b-2 border-transparent py-2 text-base select-none hover:text-foreground",
              {
                "text-foreground border-foreground": tab === i,
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
              <div className="flex-1 min-h-0 flex flex-col px-4">
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

                          <Separator />
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
                          <Separator />
                        </React.Fragment>
                      )}
                    {(charType !== "win" || isMoreOpen || showAllWords) && (
                      <>
                        {(searchResult.result as CharSearchResult).startsWith
                          .route.length > 0 && (
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
                            <Separator />
                          </>
                        )}
                        {(searchResult.result as CharSearchResult).startsWith
                          .return.length > 0 && (
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
                                      }))
                                    : []
                                }
                              />
                            </WordBox>
                            <Separator />
                          </>
                        )}
                        {(charType !== "route" ||
                          isMoreOpen ||
                          showAllWords) && (
                          <>
                            {(searchResult.result as CharSearchResult)
                              .startsWith.loscir.length > 0 && (
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
                                <Separator />
                              </>
                            )}
                            {(searchResult.result as CharSearchResult)
                              .startsWith.los.length > 0 &&
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
                                  <Separator />
                                </React.Fragment>
                              ))}
                          </>
                        )}
                      </>
                    )}
                    {!showAllWords && !isMoreOpen && charType !== "los" && (
                      <div
                        className="p-4 flex justify-center text-primary items-center gap-1 select-none cursor-pointer hover:opacity-75"
                        onClick={() => setIsMoreOpen(true)}
                      >
                        {charType === "win"
                          ? "루트 단어, 패배 단어 펼치기"
                          : "패배 단어 펼치기"}
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    )}
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
                      <Separator />
                    </>
                  )
                )}
              </div>
            </>
          )
        ) : (
          <WordSkeleton />
        ))}

      {/* 끝나는 */}

      {tab === 1 &&
        (engine ? (
          searchResult && (
            <>
              <div className="flex-1 min-h-0 flex flex-col px-4">
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
                              type: WCDisplay.reduceWordtypeWithReturn(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                            endsWith={true}
                          />
                        </WordBox>
                        <Separator />
                      </React.Fragment>
                    )}
                    {(searchResult.result as CharSearchResult).endsWith
                      .head_route.length > 0 && (
                      <React.Fragment>
                        <WordBox>
                          <WordContent
                            wordInfo={(
                              searchResult.result as CharSearchResult
                            ).endsWith.head_route.map((word) => ({
                              word,
                              type: WCDisplay.reduceWordtypeWithReturn(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                            endsWith={true}
                          />
                        </WordBox>
                        <Separator />
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
                              type: WCDisplay.reduceWordtypeWithReturn(
                                WCDisplay.getWordType(engine!, word)
                                  .type as WordType
                              ),
                            }))}
                            endsWith={true}
                          />
                        </WordBox>
                        <Separator />
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
                          endsWith={true}
                        />
                      </WordBox>
                      <Separator />
                    </>
                  )
                )}
              </div>
            </>
          )
        ) : (
          <WordSkeleton />
        ))}

      {tab === 2 && engine && (
        <>
          {engine.chanGraph.nodes[searchInputValue]?.type === "route" ? (
            <div className="p-4">
              <Analysis />
            </div>
          ) : (
            (engine.chanGraph.nodes[searchInputValue]?.type === "win" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "los" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "wincir" ||
              engine.chanGraph.nodes[searchInputValue]?.type === "loscir") && (
              <SolutionTree />
            )
          )}
        </>
      )}
      {tab === 3 && engine && searchInputValue.length === 1 && (
        <div className="flex-1 min-h-0 flex flex-col px-4">
          <WordBox>
            <WordBadge>{`${searchInputValue}에서 바꿀 수 있는 글자`}</WordBadge>
            <WordContent
              notExcept={true}
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
          <Separator />

          <WordBox>
            <WordBadge>{`${josa(
              searchInputValue,
              "으로/로"
            )} 바꿀 수 있는 글자`}</WordBadge>
            <WordContent
              notExcept={true}
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
          <Separator />
        </div>
      )}
    </>
  );
}

function WordSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col px-4">
      <>
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
      </>
    </div>
  );
}
