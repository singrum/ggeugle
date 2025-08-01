import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

const displayTypeOption = [
  { title: "개수", key: "number" },
  { title: "비율", key: "fraction" },
];

export default function DisplayTypeSettings({
  displayType,
  setDisplayType,
}: {
  displayType: "number" | "fraction";
  setDisplayType: (displayType: "number" | "fraction") => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("w-auto justify-between font-normal")}
        >
          <div className="flex items-center gap-2">
            {
              displayTypeOption.find((option) => option.key === displayType)
                ?.title
            }
          </div>
          <ChevronsUpDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={displayType}
          onValueChange={(e: string) => {
            setDisplayType(e as "number" | "fraction");
          }}
        >
          {displayTypeOption.map((option) => (
            <DropdownMenuRadioItem value={option.key} key={option.key}>
              {option.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
