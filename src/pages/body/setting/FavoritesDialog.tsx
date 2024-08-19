import React, { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWC } from "@/lib/store/useWC";
import { mex } from "@/lib/utils";
import Cookies from "js-cookie";

export default function FavoritesDialog() {
  const [ruleForm, favoritesRules, setFavoritesRules] = useWC((state) => [
    state.ruleForm,
    state.favoritesRules,
    state.setFavoritesRules,
  ]);
  const [value, setValue] = useState<string>("");
  const mexNum = useRef<number | undefined>();
  return (
    <AlertDialog
      onOpenChange={(e) => {
        if (e) {
          if (!favoritesRules) return;
          mexNum.current = mex(
            favoritesRules
              .filter(({ name }) => /^룰[0-9]*$/.test(name))
              .map(({ name }) => parseInt(name.slice(1)))
          );
          setValue(`룰${mexNum.current}`);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button className="absolute hidden" id="favorites-dialog-trigger" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>즐겨찾기에 추가</AlertDialogTitle>
          <AlertDialogDescription>
            설정한 룰을 즐겨찾기에 추가합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap">이름</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const favoritesRules_ = [
                { name: value, ruleForm },
                ...favoritesRules!,
              ];
              setFavoritesRules(favoritesRules_);

              Cookies.set("favorites-rule", JSON.stringify(favoritesRules_));
            }}
          >
            저장
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
