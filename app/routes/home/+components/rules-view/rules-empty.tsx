import { Button } from "~/components/ui/button";
import {
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

import { FolderIcon } from "@phosphor-icons/react";
import { Empty } from "~/components/ui/empty";
import AddRuleButton from "../add-rule-button";
export default function RulesEmpty() {
  return (
    <div className="text-center  px-6">
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>저장된 룰이 없습니다.</EmptyTitle>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <AddRuleButton asChild>
            <Button variant="outline">룰 추가하기</Button>
          </AddRuleButton>
        </EmptyContent>
      </Empty>
    </div>
  );
}
