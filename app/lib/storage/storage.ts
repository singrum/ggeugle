import Dexie, { type Table } from "dexie";
import { produce } from "immer";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { RuleForm } from "~/types/rule";
import type { PrecInfo } from "~/types/search";
import { getRuleFormById } from "../utils";

export class Storage extends Dexie {
  ruleMeta!: Table<{
    id: string;
    order: number;
    metadata: RuleForm["metadata"];
  }>;

  ruleContent!: Table<{
    id: string;
    content: RuleForm["content"];
  }>;

  prec!: Table<{
    ruleFormId: string;
    content: PrecInfo;
  }>;

  games!: Table<{
    id: string;
    ruleFormId: string;
    createdAt : number;
    
  }>;

  constructor() {
    super("ikki-engine-storage");
    this.version(2).stores({
      ruleMeta: "id, order",
      ruleContent: "id",
      prec: "ruleFormId",
    });
  }

  // --- 조회 로직 ---

  async getAllRuleMetas(): Promise<
    { id: string; order: number; metadata: RuleForm["metadata"] }[]
  > {
    return await this.ruleMeta.orderBy("order").toArray();
  }

  async getRuleFormById(id: string): Promise<RuleForm | null> {
    const meta = await this.ruleMeta.get(id);
    const body = await this.ruleContent.get(id);

    if (!meta || !body) return null;

    return {
      id: meta.id,
      metadata: meta.metadata,
      content: body.content,
    };
  }

  // --- 생성 로직 ---

  async addRuleForm(ruleForm: RuleForm) {
    const newId = uuidv4();
    const now = Date.now();

    const processedForm = produce(ruleForm, (draft) => {
      draft.id = newId;
      draft.metadata.updatedAt = now;
    });

    await this.transaction(
      "rw",
      [this.ruleMeta, this.ruleContent],
      async () => {
        await this.ruleMeta.toCollection().modify((item) => {
          item.order += 1;
        });

        await this.ruleMeta.add({
          id: newId,
          order: 0,
          metadata: processedForm.metadata,
        });

        await this.ruleContent.add({
          id: newId,
          content: processedForm.content,
        });
      },
    );

    return newId;
  }

  // --- 복사 로직 ---

  async copyRuleForm(id: string) {
    const original_ = await getRuleFormById(id);
    if (!original_) {
      toast.error("원본 규칙을 찾을 수 없습니다.");
      return;
    }
    const original = original_.ruleForm;

    const newId = uuidv4();
    const now = Date.now();

    const copiedForm = produce(original, (draft) => {
      draft.id = newId;
      draft.metadata.title = `${original.metadata.title}`;
      draft.metadata.updatedAt = now;
    });

    await this.transaction(
      "rw",
      [this.ruleMeta, this.ruleContent],
      async () => {
        await this.ruleMeta.toCollection().modify((item) => {
          item.order += 1;
        });

        await this.ruleMeta.add({
          id: newId,
          order: 0,
          metadata: copiedForm.metadata,
        });

        await this.ruleContent.add({
          id: newId,
          content: copiedForm.content,
        });
      },
    );

    return newId;
  }

  // --- 수정 로직 (핵심 수정) ---

  async updateRuleForm(ruleForm: RuleForm) {
    const id = ruleForm.id;
    const now = Date.now();

    // 데이터 가공
    const updatedForm = produce(ruleForm, (draft) => {
      draft.metadata.updatedAt = now;
    });

    await this.transaction(
      "rw",
      [this.ruleMeta, this.ruleContent],
      async () => {
        await this.ruleMeta.update(id, {
          metadata: updatedForm.metadata,
        });

        await this.ruleContent.update(id, {
          content: updatedForm.content,
        });
      },
    );
  }

  // --- 순서 변경 (고성능 일괄 업데이트) ---

  async reorderRules(orderedIds: string[]) {
    await this.transaction("rw", this.ruleMeta, async () => {
      const updates = orderedIds.map((id, index) =>
        this.ruleMeta.update(id, { order: index }),
      );
      await Promise.all(updates);
    });
  }

  // --- 삭제 로직 ---

  async deleteRuleForm(id: string) {
    // 1. 삭제할 대상의 현재 순서(order)를 먼저 파악해야 합니다.
    const target = await this.ruleMeta.get(id);
    if (!target) return;

    const targetOrder = target.order;

    await this.transaction(
      "rw",
      [this.ruleMeta, this.ruleContent, this.prec],
      async () => {
        await this.ruleMeta.delete(id);
        await this.ruleContent.delete(id);
        await this.prec.delete(id);
        await this.ruleMeta
          .where("order")
          .above(targetOrder)
          .modify((item) => {
            item.order -= 1;
          });
      },
    );
  }

  // --- 우선순위 맵 관련 로직 ---
  async getPrecByRuleFormId(ruleFormId: string): Promise<PrecInfo | null> {
    const record = await this.prec.get(ruleFormId);
    return record ? record.content : null;
  }

  async updatePrec(ruleFormId: string, precInfo: PrecInfo) {
    console.log(precInfo);
    await this.prec.put({ ruleFormId, content: precInfo });
    console.log("Updated precedence map for ruleFormId:", ruleFormId);
  }
}

export const storage = new Storage();
