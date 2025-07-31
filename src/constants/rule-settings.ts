import Connection from "@/app/rule-setttings/rule-settings-form-items/connection";
import Json from "@/app/rule-setttings/rule-settings-form-items/json";
import Postprocessing from "@/app/rule-setttings/rule-settings-form-items/postprocessing";
import Words from "@/app/rule-setttings/rule-settings-form-items/words";

export const ruleSettingsMenuInfo: {
  title: string;
  component: React.ComponentType;
}[] = [
  { title: "단어", component: Words },
  { title: "연결 규칙", component: Connection },
  { title: "후처리", component: Postprocessing },
  { title: "Raw 편집", component: Json },
];
