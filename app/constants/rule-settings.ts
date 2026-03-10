import Connection from "~/routes/engine/$rule/+components/rule-edit/rule-settings-form-items/connection";
import Json from "~/routes/engine/$rule/+components/rule-edit/rule-settings-form-items/json";
import Postprocessing from "~/routes/engine/$rule/+components/rule-edit/rule-settings-form-items/postprocessing";
import Words from "~/routes/engine/$rule/+components/rule-edit/rule-settings-form-items/words";

export const ruleSettingsMenuInfo: {
  title: string;
  component: React.ComponentType;
}[] = [
  { title: "단어", component: Words },
  { title: "연결 규칙", component: Connection },
  { title: "후처리", component: Postprocessing },
  { title: "Raw 편집", component: Json },
];
