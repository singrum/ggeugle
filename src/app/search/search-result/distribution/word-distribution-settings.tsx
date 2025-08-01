import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { ChevronsUpDown, Hash, Percent } from "lucide-react";

const adjacentOptions = ["다음 단어", "이전 단어"];
const nonAdjacentOptions = [
  { title: "이전/다음 단어 비율", key: "ratio" },
  { title: "이전/다음 단어 차이", key: "difference" },
];

const displayTypeOptions = [
  { title: "개수", key: "number", icon: Hash },
  { title: "비율", key: "fraction", icon: Percent },
];
export default function WordDistributionSettings() {
  const option = useWcStore((e) => e.wordDistributionOption);

  const { title, icon: Icon } =
    option.type === "adjacent"
      ? displayTypeOptions.find((e) => e.key === option.displayType)!
      : displayTypeOptions[0];
  return (
    <div className="flex flex-1 justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className={cn("w-auto justify-between font-normal")}
          >
            {option.type === "adjacent"
              ? adjacentOptions[option.direction]
              : nonAdjacentOptions.find(({ key }) => option.type === key)
                  ?.title}

            {<ChevronsUpDown className="size-3" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50">
          <DropdownMenuRadioGroup
            value={`${option.type === "adjacent" ? "adjacent-" + option.direction : option.type}`}
            onValueChange={(e: string) => {
              const [type, direction] = e.split("-");
              useWcStore.setState((state) => {
                state.wordDistributionOption.type = type as
                  | "adjacent"
                  | "ratio";
                if (state.wordDistributionOption.type === "adjacent") {
                  state.wordDistributionOption.direction = Number(direction) as
                    | 0
                    | 1;
                  state.wordDistributionOption.sort = {
                    key: "total",
                    desc: true,
                  };
                } else {
                  state.wordDistributionOption.desc = true;
                  state.wordDistributionOption.wordTypes =
                    state.distributionNodeType === "route"
                      ? [1, 1]
                      : ["total", "total"];
                }
              });
            }}
          >
            {adjacentOptions.map((_, i) => (
              <DropdownMenuRadioItem
                value={`adjacent-${i}`}
                key={`adjacent-${i}`}
              >
                {adjacentOptions[i]}
              </DropdownMenuRadioItem>
            ))}
            <DropdownMenuSeparator />
            {nonAdjacentOptions.map((e) => (
              <DropdownMenuRadioItem value={e.key} key={e.key}>
                {e.title}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* displaytype */}
      {option.type === "adjacent" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className={cn("w-auto justify-between font-normal")}
            >
              <Icon />
              <div className="flex items-center gap-2">{title}</div>
              <ChevronsUpDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuRadioGroup
              value={option.displayType}
              onValueChange={(e: string) => {
                useWcStore.setState((state) => {
                  if (state.wordDistributionOption.type === "adjacent") {
                    state.wordDistributionOption.displayType = e as
                      | "fraction"
                      | "number";
                  }
                });
              }}
            >
              {displayTypeOptions.map(({ key, title, icon: Icon }) => (
                <DropdownMenuRadioItem value={key} key={key}>
                  <Icon className="stroke-muted-foreground" />
                  {title}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
