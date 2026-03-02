import Dexie, { type Table } from "dexie";
import { produce } from "immer";
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
    const data = await this.ruleMeta.orderBy("order").toArray();
    return data;
  }

  async getRuleFormById(id: string): Promise<RuleForm> {
    const meta = await this.ruleMeta.get(id);
    const body = await this.ruleContent.get(id);

    if (!meta || !body) {
      throw new Error("해당 룰을 찾을 수 없습니다.");
    }

    return {
      id: meta.id,
      metadata: meta.metadata,
      content: body.content,
    };
  }

  // --- 생성 로직 ---

  async addRuleForm(ruleForm: RuleForm): Promise<string> {
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

  async copyRuleForm(id: string): Promise<string> {
    const original_ = await getRuleFormById(id);
    if (!original_) {
      throw new Error("복사할 원본 룰을 찾을 수 없습니다.");
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

  async updateRuleForm(ruleForm: RuleForm): Promise<string> {
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

    return id;
  }

  // --- 순서 변경 (고성능 일괄 업데이트) ---

  async reorderRules(orderedIds: string[]): Promise<void> {
    await this.transaction("rw", this.ruleMeta, async () => {
      const updates = orderedIds.map((id, index) =>
        this.ruleMeta.update(id, { order: index }),
      );
      await Promise.all(updates);
    });
  }

  // --- 삭제 로직 ---

  async deleteRuleForm(id: string): Promise<string> {
    const target = await this.ruleMeta.get(id);
    if (!target) throw new Error("삭제할 룰을 찾을 수 없습니다.");

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
    return id;
  }

  // --- 우선순위 맵 관련 로직 ---
  async getPrecByRuleFormId(ruleFormId: string): Promise<PrecInfo | null> {
    const record = await this.prec.get(ruleFormId);
    return record ? record.content : null;
  }

  async updatePrec(ruleFormId: string, precInfo: PrecInfo): Promise<string> {
    await this.prec.put({ ruleFormId, content: precInfo });
    return ruleFormId;
  }
}

export const storage = new Storage();
