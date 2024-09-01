import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/pages/header/Header";
import { RuleSetting } from "./RuleSetting";

export default function Setting() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="md:min-h-0 md:overflow-auto h-full md:h-full w-full md:flex md:justify-center">
      <div className="w-full md:max-w-screen-md flex flex-col gap-5 min-h-0">
        <div className="md:p-5 min-h-0">
          <RuleSetting />
        </div>
      </div>
    </div>
  );
}
