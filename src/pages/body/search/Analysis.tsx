import DFSSearch from "./analysis/DFSSearch";
export default function Analysis() {
  // const [searchMethod, setSearchMethod] = useState<"dfs" | "ids">("ids");
  // const [searchInputValue, engine] = useWC((e) => [
  //   e.searchInputValue,
  //   e.engine,
  // ]);

  return (
    <>
      <div className="w-full">
        {/* <Select
          value={searchMethod}
          onValueChange={(e: "dfs" | "ids") => setSearchMethod(e)}
        >
          <SelectTrigger className="w-[180px] text-sm mb-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ids">깊이 심화 탐색(IDS)</SelectItem>
            <SelectItem value="dfs">깊이 우선 탐색(DFS)</SelectItem>
          </SelectContent>
        </Select> */}
        {/* {searchMethod === "ids" ? <IDSSearch /> :  */}
        <DFSSearch />
        {/* } */}
      </div>
    </>
  );
}
