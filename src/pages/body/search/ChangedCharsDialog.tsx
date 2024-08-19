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
  TableRow
} from "@/components/ui/table";
import { useWC } from "@/lib/store/useWC";

export function ChangedCharsDialog({}: {}) {
  const [changeInfo, setValue, setSearchInputValue] = useWC((e) => [
    e.changeInfo,
    e.setValue,
    e.setSearchInputValue,
  ]);
  const changedChars = Object.keys(changeInfo).sort();

  return (
    // <div></div>
    <Dialog>
      <DialogTrigger>
        <div className="absolute hidden" id="changed-char-dialog-open" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] min-h-0 overflow-auto  scrollbar-thin">
        <DialogHeader>
          <DialogTitle>최근에 변경된 글자</DialogTitle>
          <DialogDescription className="">
            단어 추가 및 제외에 의해 최근에 유형이 변경된 글자들입니다.
          </DialogDescription>
        </DialogHeader>

        {changedChars.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead className="w-[100px] text-center">글자</TableHead>
                <TableHead className="text-center">변경 전</TableHead>
                <TableHead className="text-center">변경 후</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changedChars.map((char) => (
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
                        className={`flex items-center justify-center py-1 px-2 bg-${changeInfo[char].prevType} bg-${changeInfo[char].prevType}/10 rounded-full text-${changeInfo[char].prevType}`}
                      >
                        {changeInfo[char].prevType === "route"
                          ? "루트"
                          : changeInfo[char].prevType === "win"
                          ? "승리"
                          : "패배"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div
                        className={`flex items-center justify-center py-1 px-2 bg-${
                          changeInfo[char].currType
                        } bg-${
                          changeInfo[char].currType
                        }/10 rounded-full text-${changeInfo[char].currType} ${
                          changeInfo[char].currType === "deleted"
                            ? "muted-foreground"
                            : changeInfo[char].currType
                        }`}
                      >
                        {changeInfo[char].currType === "route"
                          ? "루트"
                          : changeInfo[char].currType === "win"
                          ? "승리"
                          : changeInfo[char].currType === "los"
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
          <div className="flex items-center justify-center border border-border rounded-md p-2 w-full gap-2 h-[10rem]">
            <div className="text-muted-foreground">변경된 글자가 없습니다.</div>
          </div>
        )}
      </DialogContent>
      <DialogClose asChild>
        <button className="absolute hidden" id="changed-chars-dialog-close" />
      </DialogClose>
    </Dialog>
  );
}
