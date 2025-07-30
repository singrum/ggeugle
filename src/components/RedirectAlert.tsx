import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "./ui/button";

export default function RedirectAlert() {
  const [open, setOpen] = useState(true);
  return (
    <AlertDialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className="absolute hidden">
          <AlertDialogTitle>새로운 버전 리디렉션 알림</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 text-center">
          <p>끄글이 새롭게 업데이트되었습니다. </p>
          <p>새로운 페이지로 이동할까요?</p>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Button variant={"ghost"} className="" onClick={() => setOpen(false)}>
            닫기
          </Button>

          <Button
            onClick={() => {
              window.location.href = "https://engine.ikki.app";
            }}
          >
            바로가기
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
