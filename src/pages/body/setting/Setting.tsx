import { RuleSetting } from "./RuleSetting";

export default function Setting() {
  return (
    <div className="md:min-h-0 md:overflow-auto h-full md:h-full w-full md:flex md:justify-center">
      <div className="w-full flex flex-col gap-5 min-h-0 overflow-auto">
        <div className="md:p-5 ">
          <RuleSetting />
        </div>
      </div>
    </div>
  );
}
