import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWC } from "@/lib/store/useWC";
import {
  CharSearchResult,
  NoncharSearchResult,
  WCDisplay,
  WordType,
} from "@/lib/wc/wordChain";
import { CircleHelp } from "lucide-react";
import React from "react";

export default function SearchResult() {
  return (
    <>
      {/* <CharResult /> */}

      <WordsResult />
      <div className="h-[50vh]" />
    </>
  );
}

function WordsResult() {
  const [searchResult, engine] = useWC((e) => [e.searchResult, e.engine]);

  return (
    <Tabs
      defaultValue="startsWith"
      className="w-full flex flex-col items-center"
    >
      <TabsList className="h-auto">
        <TabsTrigger
          className="text-xs"
          value="startsWith"
        >{`~로 시작하는 단어`}</TabsTrigger>
        <TabsTrigger
          className="text-xs"
          value="endsWith"
        >{`~로 끝나는 단어`}</TabsTrigger>
      </TabsList>

      <>
        <TabsContent value="startsWith" className="w-full">
          {engine ? (
            searchResult && (
              <>
                <div className="flex-1 min-h-0">
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
                      {(searchResult.result as CharSearchResult).startsWith
                        .wincir.length > 0 &&
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
                          <Separator className="my-2" />
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
                                되돌림 단어의 유무는 승패에 영향을 주지
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

                      {(searchResult.result as CharSearchResult).startsWith
                        .loscir.length > 0 && (
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
          )}
        </TabsContent>
        {/* 끝나는 */}

        <TabsContent value="endsWith" className="w-full">
          {engine ? (
            searchResult && (
              <>
                <div className="flex-1 min-h-0">
                  {searchResult.isChar === true ? (
                    <>
                      {(searchResult.result as CharSearchResult).endsWith
                        .head_los.length > 0 && (
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
                    (searchResult.result as NoncharSearchResult).endsWith
                      .length > 0 && (
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
          )}
        </TabsContent>
      </>
    </Tabs>
  );
}
