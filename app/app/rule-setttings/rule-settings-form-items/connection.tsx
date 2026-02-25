import { OutlineCard } from "../../../components/outline-card";
import ChangeRule from "./connection/change-rule";
import HeadIndex from "./connection/head-index";
import TailIndex from "./connection/tail-index";

export default function Connection() {
  return (
    <div className="space-y-4">
      <OutlineCard>
        <ChangeRule />
      </OutlineCard>
      <OutlineCard>
        <HeadIndex />

        <TailIndex />
      </OutlineCard>
    </div>
  );
}
