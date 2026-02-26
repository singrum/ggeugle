import Dexie, { type Table } from "dexie";
import v4 from "node_modules/uuid/dist/v4";
import { toast } from "sonner";
import type { RuleForm } from "~/types/rule";
import { getRuleFormById } from "../utils";

export class Storage extends Dexie {
  rule!: Table<{ id: string; ruleForm: RuleForm }>;

  constructor() {
    super("ikki-engine-storage");
    this.version(1).stores({
      rule: "id",
    });
  }
  async copyRuleForm(id: string) {
    const data = await getRuleFormById(id);
    if (!data) toast.error("규칙을 불러오는 데 실패했습니다.");
    const newId = v4();
    storage.rule.add({
      id: newId,
      ruleForm: {
        ...data!.ruleForm,
        metadata: {
          ...data!.ruleForm.metadata,
          id: newId,
          updatedAt: Date.now(),
          title: `${data!.ruleForm.metadata.title}`,
        },
      },
    });
  }
  async addRuleForm(ruleForm: RuleForm) {
    const newId = v4();
    const now = Date.now();
    await storage.rule.add({
      id: newId,
      ruleForm: {
        ...ruleForm,
        metadata: {
          ...ruleForm.metadata,
          id: newId,
          updatedAt: Date.now(),
        },
      },
    });
    return newId;
  }

  async updateRuleForm(ruleForm: RuleForm) {
    await storage.rule.put({
      id: ruleForm.metadata.id,
      ruleForm: {
        ...ruleForm,
        metadata: {
          ...ruleForm.metadata,
          updatedAt: Date.now(),
        },
      },
    });
  }

  async getRuleFormById(id: string): Promise<RuleForm | null> {
    const data = await storage.rule.get(id);
    if (!data) return null;
    return data.ruleForm;
  }
  async deleteRuleForm(id: string) {
    await storage.rule.delete(id);
  }
}

export const storage = new Storage();
