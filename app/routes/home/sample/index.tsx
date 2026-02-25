import { ScrollIcon } from "@phosphor-icons/react";
import { Link, type MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { sampleRules } from "~/constants/sample-rules";

export const meta: MetaFunction = () => {
  return [{ title: "기본 룰" }];
};

export default function Sample() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">기본 룰</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {sampleRules.map(({ metadata: { title, id } }) => (
          <Button
            key={id}
            variant="secondary"
            size="lg"
            className="flex flex-col justify-start items-start h-auto py-4 space-y-2 rounded-lg px-3 text-left"
            asChild
          >
            <Link to={`/engine/${encodeURIComponent(id)}`}>
              <div className="flex items-center gap-2 w-full">
                <ScrollIcon className="size-5" weight="fill" />

                <span className="truncate flex-1 ">{title}</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
