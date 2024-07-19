import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";
import { Separator } from "@/components/ui/separator";

import { useWC } from "@/lib/store/useWC";
import React, { useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { josa } from "es-hangul";
import {
  CharSearchResult,
  NoncharSearchResult,
  WCDisplay,
  WordType,
} from "@/lib/wc/wordChain";

export default function SearchResult() {
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
          {searchResult && (
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
                    {((searchResult.result as CharSearchResult).startsWith.route
                      .length > 0 ||
                      (searchResult.result as CharSearchResult).startsWith
                        .route_return.length > 0) && (
                      <>
                        <WordBox>
                          <WordBadge>{`루트단어`}</WordBadge>
                          <WordContent
                            wordInfo={((searchResult.result as CharSearchResult)
                              .startsWith.route
                              ? (
                                  searchResult.result as CharSearchResult
                                ).startsWith.route.map((word) => ({
                                  word,
                                  type: "route",
                                }))
                              : []
                            ).concat(
                              (searchResult.result as CharSearchResult)
                                .startsWith.route_return
                                ? (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.route_return.map((word) => ({
                                    word,
                                    type: "route",
                                    returning: true,
                                  }))
                                : []
                            )}
                          />
                        </WordBox>
                        <Separator className="my-2" />
                      </>
                    )}
                    {((searchResult.result as CharSearchResult).startsWith
                      .loscir.length > 0 ||
                      (searchResult.result as CharSearchResult).startsWith
                        .loscir_return.length > 0) && (
                      <>
                        <WordBox>
                          <WordBadge>{`조건부 패배`}</WordBadge>
                          <WordContent
                            wordInfo={((searchResult.result as CharSearchResult)
                              .startsWith.loscir
                              ? (
                                  searchResult.result as CharSearchResult
                                ).startsWith.loscir.map((word) => ({
                                  word,
                                  type: "los",
                                }))
                              : []
                            ).concat(
                              (searchResult.result as CharSearchResult)
                                .startsWith.loscir_return.length
                                ? (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.loscir_return.map((word) => ({
                                    word,
                                    type: "los",
                                    returning: true,
                                  }))
                                : []
                            )}
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
          )}
        </TabsContent>
        {/* 끝나는 */}

        <TabsContent value="endsWith" className="w-full">
          {searchResult && (
            <>
              <div className="flex-1 min-h-0">
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
          )}
        </TabsContent>
      </>
    </Tabs>
  );
}
