import { Waypoints } from "lucide-react";

export default function Logo() {
  return (
    <div
      className="font-semibold text-lg ml-1 cursor-pointer flex gap-1 items-center md:flex-col md:gap-0 lg:gap-1 lg:flex-row"
      onClick={() => {
        location.reload();
      }}
    >
      <Waypoints className="w-5 h-5 fill-foreground" strokeWidth={1} />
      <div className="">끄글</div>
    </div>
  );
}
