import { CardHeader, CardTitle } from "@/components/ui/card";
import { difficultyInfo } from "@/constants/play";
import { useWcStore } from "@/stores/wc-store";

export default function GameTitle({ id }: { id: string }) {
  const difficulty = useWcStore((e) => e.gameMap[id].difficulty);
  const calculatingDuration = useWcStore(
    (e) => e.gameMap[id].calculatingDuration,
  );
  const isFirst = useWcStore((e) => e.gameMap[id].isFirst);
  const stealable = useWcStore((e) => e.gameMap[id].stealable);

  return (
    <CardHeader className="w-full px-0">
      <CardTitle className="leading-5 font-medium">
        {difficultyInfo[difficulty].title}
        <span className="text-muted-foreground">
          {difficulty === 2 ? `(${calculatingDuration}초)` : ""}
        </span>
        {" · "}
        {isFirst ? "선공" : "후공"}
        {" · "}
        {stealable ? "단어 뺏기 허용" : "단어 뺏기 불가"}
      </CardTitle>
    </CardHeader>
  );
}
