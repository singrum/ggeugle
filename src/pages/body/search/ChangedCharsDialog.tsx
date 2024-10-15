import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWC } from "@/lib/store/useWC";

const changeTypeList = [{ name: "최근과 비교" }, { name: "원본과 비교" }];

export function ChangedCharsDialog({}: {}) {
  const [changeInfo, setValue, setSearchInputValue] = useWC((e) => [
    e.changeInfo,
    e.setValue,
    e.setSearchInputValue,
  ]);

  const compPrevChars = Object.keys(changeInfo.compPrev).sort();
  const compOriginChars = Object.keys(changeInfo.compOrigin).sort();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute hidden" id="changed-char-dialog-open" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] min-h-0 overflow-auto  scrollbar-thin">
        <DialogHeader>
          <DialogTitle>글자 유형 비교</DialogTitle>
          <DialogDescription className="">
            단어를 제거하거나 추가하기 이전과 글자 유형을 비교합니다.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="compPrev" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compPrev">이전과 비교</TabsTrigger>
            <TabsTrigger value="compOrigin">원본과 비교</TabsTrigger>
          </TabsList>
          {[
            { changeType: "compPrev", chars: compPrevChars },
            { changeType: "compOrigin", chars: compOriginChars },
          ].map(({ changeType, chars }) => (
            <TabsContent value={changeType} key={changeType}>
              {chars.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-center">
                        글자
                      </TableHead>
                      <TableHead className="text-center">변경 전</TableHead>
                      <TableHead className="text-center">변경 후</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chars.map((char) => (
                      <TableRow
                        key={char}
                        className="cursor-pointer"
                        onClick={() => {
                          setValue(char);
                          setSearchInputValue(char);
                          document
                            .getElementById("changed-chars-dialog-close")
                            ?.click();
                        }}
                      >
                        <TableCell className="font-medium text-center">
                          {char}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <div
                              className={`flex items-center justify-center py-1 px-2 bg-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].prevType
                              } bg-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].prevType
                              }/10 rounded-full text-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].prevType
                              }`}
                            >
                              {changeInfo[
                                changeType as "compPrev" | "compOrigin"
                              ][char].prevType === "route"
                                ? "루트"
                                : changeInfo[
                                    changeType as "compPrev" | "compOrigin"
                                  ][char].prevType === "win"
                                ? "승리"
                                : "패배"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <div
                              className={`flex items-center justify-center py-1 px-2 bg-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].currType
                              } bg-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].currType
                              }/10 rounded-full text-${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].currType
                              } ${
                                changeInfo[
                                  changeType as "compPrev" | "compOrigin"
                                ][char].currType === "deleted"
                                  ? "muted-foreground"
                                  : changeInfo[
                                      changeType as "compPrev" | "compOrigin"
                                    ][char].currType
                              }`}
                            >
                              {changeInfo[
                                changeType as "compPrev" | "compOrigin"
                              ][char].currType === "route"
                                ? "루트"
                                : changeInfo[
                                    changeType as "compPrev" | "compOrigin"
                                  ][char].currType === "win"
                                ? "승리"
                                : changeInfo[
                                    changeType as "compPrev" | "compOrigin"
                                  ][char].currType === "los"
                                ? "패배"
                                : "삭제됨"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center border border-border border-dashed rounded-md p-2 w-full gap-2 h-[10rem]">
                  <div className="text-muted-foreground">
                    변경된 글자가 없습니다.
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
      <DialogClose asChild>
        <button className="absolute hidden" id="changed-chars-dialog-close" />
      </DialogClose>
    </Dialog>
  );
}
