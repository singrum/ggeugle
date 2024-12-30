import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchMethod } from "@/lib/store/useSearchMethod";
import { CircleHelp } from "lucide-react";
import DFSSearch from "./analysis/DFSSearch";
import IDSSearch from "./analysis/IDSSearch";
export default function Analysis() {
  const [searchMethod, setSearchMethod] = useSearchMethod((e) => [
    e.searchMethod,
    e.setSearchMethod,
  ]);

  return (
    <>
      <div className="p-4 w-full md:p-6 lg:p-8 lg:pt-6">
        <div className="flex gap-0 mb-4">
          <Select
            value={searchMethod}
            onValueChange={(e: "dfs" | "ids") => setSearchMethod(e)}
          >
            <SelectTrigger className="w-[180px] text-sm mb-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dfs">깊이 우선 탐색(DFS)</SelectItem>
              <SelectItem value="ids">깊이 심화 탐색(IDS)</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                size="icon"
                className="text-muted-foreground hover:bg-transparent"
              >
                <CircleHelp className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[270px] text-sm">
              <div className="flex flex-col gap-2">
                {searchMethod === "dfs" ? (
                  <>
                    <p>게임이 종료되는 시점까지 모든 경로를 탐색합니다.</p>
                    <p>
                      단어들의{" "}
                      <span className="font-semibold">선택지가 적고</span>{" "}
                      <span className="font-semibold">게임 진행이 긴 경우</span>
                      에 유리한 탐색 방법입니다.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      게임 진행이{" "}
                      <span className="font-semibold">최대 깊이</span>보다
                      길어지면 더 이상 탐색하지 않고 다른 수를 탐색합니다. 최대
                      깊이 내에서 승패 여부를 알아내지 못하면 최대 깊이를{" "}
                      <span className="font-semibold">1씩 증가</span> 시킨 후
                      다시 탐색합니다.
                    </p>
                    <p>
                      단어들의{" "}
                      <span className="font-semibold">선택지가 많고</span>{" "}
                      <span className="font-semibold">
                        게임 진행이 짧은 경우
                      </span>
                      에 유리한 탐색 방법입니다.
                    </p>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {searchMethod === "ids" ? <IDSSearch /> : <DFSSearch />}
      </div>
    </>
  );
}
