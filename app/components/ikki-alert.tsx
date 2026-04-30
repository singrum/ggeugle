import IkkiLogo from "~/routes/home/+components/ikki-logo";
import { useIkkiAlertStore } from "~/stores/ikki-alert-store";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function IkkiAlert() {
  const open = useIkkiAlertStore((state) => state.open);
  const setOpen = useIkkiAlertStore((state) => state.setOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hidden absolute" />
      </DialogTrigger>
      <DialogContent className="bg-[#302e2f] text-[#d9d9d6]">
        <div className="flex flex-col gap-6 items-start wrap-break-word break-keep">
          <IkkiLogo className="h-8 w-auto text-[#6eaf4b]" />
          <div className="text-base font-semibold">
            온라인 끝말잇기 플랫폼, 이끼가 리뉴얼되었습니다!
          </div>
          <div className="flex justify-between w-full">
            <Button size="lg" asChild>
              <a
                href="https://ikki.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로 가기
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
