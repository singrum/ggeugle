import { sampleRules } from "@/constants/sample-rules";
import { NavLink } from "react-router";
import KkutuRuleButton from "./kkutu-rule-button";
import SampleRuleButton from "./sample-rule-button";

export default function SampleRuleList() {
  return (
    <div className="flex flex-col gap-4">
      <KkutuRuleButton />
      {sampleRules.map((e) => (
        <NavLink to={`/home?rule=${e.metadata!.title}`} key={e.metadata!.title}>
          <SampleRuleButton data={e} />
        </NavLink>
      ))}
    </div>
  );
}
