import { Separator } from "~/components/ui/separator";

import { OutlineCard } from "../../outline-card";
import ChangeRule from "./connection/change-rule";
import HeadIndex from "./connection/head-index";
import TailIndex from "./connection/tail-index";

export default function Connection() {
  return (
    <div className="space-y-4">
      <OutlineCard>
        <ChangeRule />
      </OutlineCard>{" "}
      <div className="px-4">
        <Separator />
      </div>
      <OutlineCard>
        <HeadIndex />

        <TailIndex />
      </OutlineCard>
    </div>
  );
}
