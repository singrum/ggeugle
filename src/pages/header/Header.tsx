import { useMenu } from "@/lib/store/useMenu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PreferenceSetting from "../body/etc/PreferenceSetting";
export default function Header({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "top-0 flex flex-col min-h-9 z-10 sticky bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 px-1",
        className
      )}
    >
      <div className="flex w-full justify-between items-center">
        <div
          className="flex items-end gap-1 p-2"
          onClick={() => {
            location.reload();
          }}
        >
          <Logo />
          <div className="text-muted-foreground mb-1 text-xs">
            끝말잇기 검색엔진
          </div>
        </div>

        <div
          className="flex justify-center items-center cursor-pointer transition-colors p-2 hover:bg-accent rounded-lg"
          onClick={() =>
            document
              .getElementById("preference-setting-dialog-trigger")
              ?.click()
          }
        >
          <Settings className="w-5 h-5" />
          <PreferenceDialog />
        </div>
      </div>
    </div>
  );
}
function PreferenceDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          id="preference-setting-dialog-trigger"
          className="absolute hidden"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>환경 설정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PreferenceSetting />
      </DialogContent>
    </Dialog>
  );
}
