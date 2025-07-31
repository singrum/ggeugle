import type { NodeType } from "@/lib/wordchain/graph/graph";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CharButton from "./char-button";
const MAX_DISPLAY = 3;
export default function CharButtons({
  chars,
}: {
  chars: { char: string; variant: NodeType }[];
}) {
  const smallNodes = chars.slice(0, MAX_DISPLAY);
  return (
    <div className="flex items-center whitespace-nowrap">
      {smallNodes.map(({ char, variant }) => (
        <CharButton key={char + variant} variant={variant}>
          {char}
        </CharButton>
      ))}
      {chars.length > MAX_DISPLAY && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size="sm"
              className="text-muted-foreground -mx-2"
            >
              +{chars.length - MAX_DISPLAY}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-wrap">
            {chars.map(({ variant, char }) => (
              <CharButton key={char + variant} variant={variant}>
                {char}
              </CharButton>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
