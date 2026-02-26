import Dexie, { type Table } from "dexie";
import type { RuleForm } from "~/types/rule";

export class Storage extends Dexie {
  rule!: Table<{ id: string; ruleForm: RuleForm }>;

  constructor() {
    super("ikki-engine-storage");
    this.version(1).stores({
      rule: "id",
    });
  }
}

export const storage = new Storage();
