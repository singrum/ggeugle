import { kkutuInfo } from "@/constants/rule";
import { sampleRules } from "@/constants/sample-rules";
import { useWcStore } from "@/stores/wc-store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const useMount = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ruleName = queryParams.get("rule");
  const setRule = useWcStore((e) => e.setRule);
  const navigate = useNavigate();
  const updateRule = useWcStore((e) => e.updateRule);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isMounted === true) {
      return;
    }
    const toGuel = () => {
      params.set("rule", "구엜룰"); // 디폴트 값 설정
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      setRule(sampleRules[0]);
    };
    if (!ruleName || ruleName === "custom") {
      toGuel();
    } else if (ruleName.split("-")[0] === "끄투코리아") {
      const [, gameTypeName, injeongName, mannerName] = ruleName.split("-");
      const gameType = kkutuInfo.gameType.indexOf(gameTypeName);
      const injeong = kkutuInfo.injeong.indexOf(injeongName);
      const manner = kkutuInfo.manner.indexOf(mannerName);
      if (gameType !== -1 && injeong !== -1 && manner !== -1) {
        useWcStore.setState((state) => {
          state.kkutuLocalRule = { gameType, injeong: injeong === 1, manner };
        });
        useWcStore.getState().setKkutuRule();
      } else {
        toGuel();
      }
    } else {
      const ruleForm = sampleRules.find((e) => e.metadata?.title === ruleName);
      if (ruleForm) {
        setRule(ruleForm);
      } else {
        toGuel();
      }
    }

    setIsMounted(true);
  }, [
    setRule,
    updateRule,
    isMounted,
    location.pathname,
    navigate,
    ruleName,
    location.search,
  ]);

  return isMounted;
};
