import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { sampleRules } from "~/constants/sample-rules";

export default function AddRuleButton({
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  const handleExternalClick = (ruleId: string) => {
    window.dispatchEvent(new CustomEvent("select_rule", { detail: ruleId }));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>복사할 룰 선택</DropdownMenuLabel>
          {sampleRules.map((rule) => (
            <DropdownMenuItem
              key={rule.id}
              onClick={() => handleExternalClick(rule.id)}
            >
              {rule.metadata.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
