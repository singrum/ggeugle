import { useEffect, useState } from "react";
import { getRuleFormById } from "~/lib/utils";
import type { RuleForm } from "~/types/rule";
import { RuleEditorStoreProvider } from "../rule-editor-store-provider";
import RuleEditContent from "./rule-edit-content";

import { ScrollArea } from "~/components/ui/scroll-area";
import { RuleEditFooter } from "./rule-edit-footer";
import RuleEditHeader from "./rule-edit-header";

export function RuleEditForm({ ruleId }: { ruleId: string }) {
  const [loading, setLoading] = useState(true);
  const [ruleForm, setRuleForm] = useState<RuleForm | null>(null);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const data = await getRuleFormById(ruleId);
        if (data) {
          setRuleForm(data.ruleForm);
          setIsSample(data.isSample);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [ruleId]);
  if (loading || ruleForm === null) {
    return null;
  }
  return (
    <RuleEditorStoreProvider ruleForm={ruleForm} isSample={isSample}>
      <div className="h-full flex flex-col">
        <RuleEditHeader />

        <ScrollArea className="h-full flex-1 min-h-0">
          <RuleEditContent />
        </ScrollArea>
        <RuleEditFooter />
      </div>
    </RuleEditorStoreProvider>
  );
}
