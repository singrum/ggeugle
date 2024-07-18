import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";
import { Separator } from "@/components/ui/separator";
import { useSearch } from "@/lib/store/useSearch";
import { useWC } from "@/lib/store/useWC";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { josa } from "es-hangul";
export default function SearchResult() {
  const value = useSearch((e) => e.value);
  const setValue = useSearch((e) => e.value);
  const wordClass = useWC((e) => e.wordClass);

  return (
    <Tabs
      defaultValue="start-with"
      className="w-full flex flex-col items-center"
    >
      <TabsList>
        <TabsTrigger value="start-with">{`~로 시작하는 단어`}</TabsTrigger>
        <TabsTrigger value="end-with">{`~로 끝나는 단어`}</TabsTrigger>
      </TabsList>

      <>
        <TabsContent value="start-with" className="w-full">
          {wordClass && wordClass.outWordClass && (
            <>
              <div className="flex-1 min-h-0">
                {Object.keys(wordClass.outWordClass)
                  .filter((e) => parseInt(e) >= 0)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((e) => (
                    <React.Fragment key={e}>
                      <WordBox key={e}>
                        <WordBadge>{`${e}턴 후 승리`}</WordBadge>
                        <WordContent
                          wordInfo={wordClass!.outWordClass[e].map((word) => ({
                            word,
                            type: "win",
                          }))}
                        />
                      </WordBox>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
                {wordClass.outWordClass["WINCIR"] && (
                  <React.Fragment>
                    <WordBox>
                      <WordBadge>{`조건부 승리`}</WordBadge>
                      <WordContent
                        wordInfo={wordClass!.outWordClass["WINCIR"].map(
                          (word) => ({
                            word,
                            type: "win",
                          })
                        )}
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </React.Fragment>
                )}
                {(wordClass.outWordClass["ROUTE"] ||
                  wordClass.outWordClass["ROUTE_RETURN"]) && (
                  <>
                    <WordBox>
                      <WordBadge>{`루트단어`}</WordBadge>
                      <WordContent
                        wordInfo={(wordClass!.outWordClass["ROUTE"]
                          ? wordClass!.outWordClass["ROUTE"].map((word) => ({
                              word,
                              type: "route",
                            }))
                          : []
                        ).concat(
                          wordClass!.outWordClass["ROUTE_RETURN"]
                            ? wordClass!.outWordClass["ROUTE_RETURN"].map(
                                (word) => ({
                                  word,
                                  type: "route",
                                  returning: true,
                                })
                              )
                            : []
                        )}
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </>
                )}
                {(wordClass.outWordClass["LOSCIR"] ||
                  wordClass.outWordClass["LOSCIR_RETURN"]) && (
                  <>
                    <WordBox>
                      <WordBadge>{`조건부 패배`}</WordBadge>
                      <WordContent
                        wordInfo={(wordClass.outWordClass["LOSCIR"]
                          ? wordClass!.outWordClass["LOSCIR"].map((word) => ({
                              word,
                              type: "los",
                            }))
                          : []
                        ).concat(
                          wordClass.outWordClass["LOSCIR_RETURN"]
                            ? wordClass!.outWordClass["LOSCIR_RETURN"].map(
                                (word) => ({
                                  word,
                                  type: "los",
                                  returning: true,
                                })
                              )
                            : []
                        )}
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </>
                )}
                {Object.keys(wordClass.outWordClass)
                  .filter((e) => parseInt(e) < 0)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((e) => (
                    <React.Fragment key={e}>
                      <WordBox key={e}>
                        <WordBadge>{`${-e}턴 후 패배`}</WordBadge>
                        <WordContent
                          wordInfo={wordClass!.outWordClass[e].map((word) => ({
                            word,
                            type: "los",
                          }))}
                        />
                      </WordBox>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
              </div>
            </>
          )}
        </TabsContent>
        {/* 끝나는 */}

        <TabsContent value="end-with" className="w-full">
          {wordClass && wordClass.inWordClass && (
            <>
              <div className="flex-1 min-h-0">
                {wordClass.inWordClass["WIN"] && (
                  <React.Fragment>
                    <WordBox>
                      {/* <WordBadge>{``}</WordBadge> */}
                      <WordContent
                        wordInfo={wordClass!.inWordClass["WIN"].map((word) => ({
                          word,
                          type: "foreground",
                        }))}
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </React.Fragment>
                )}
                {(wordClass.inWordClass["ROUTE"] ||
                  wordClass.inWordClass["ROUTE"]) && (
                  <>
                    <WordBox>
                      <WordBadge>{`루트단어`}</WordBadge>
                      <WordContent
                        wordInfo={
                          wordClass!.inWordClass["ROUTE"]
                            ? wordClass!.inWordClass["ROUTE"].map((word) => ({
                                word,
                                type: "foreground",
                              }))
                            : []
                        }
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </>
                )}
                {(wordClass.inWordClass["REST"] ||
                  wordClass.inWordClass["REST"]) && (
                  <>
                    <WordBox>
                      <WordContent
                        wordInfo={
                          wordClass!.inWordClass["REST"]
                            ? wordClass!.inWordClass["REST"].map((word) => ({
                                word,
                                type: "foreground",
                              }))
                            : []
                        }
                      />
                    </WordBox>
                    <Separator className="my-2" />
                  </>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </>
    </Tabs>
  );
}
