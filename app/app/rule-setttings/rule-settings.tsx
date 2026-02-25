import RuleSettingsAlertBar from "./rule-settings-alert-bar/rule-settings-alert-bar";
import RuleSettingsForm from "./rule-settings-form/rule-settings-form";
import RuleSettingsHeader from "./rule-settings-header/rule-settings-header";
import RuleSettingsMenu from "./rule-settings-header/rule-settings-menu";

export default function RuleSettings() {
  return (
    <div className="relative flex h-full w-full min-w-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        <RuleSettingsHeader />
        <RuleSettingsMenu />
        <RuleSettingsForm />
      </div>
      <RuleSettingsAlertBar />
    </div>
  );
}
