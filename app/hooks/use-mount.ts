import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { sampleRules } from "~/constants/sample-rules";
import { useWcStore } from "~/stores/wc-store-provider";

export const useMount = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  const { rule } = useParams();

  const setRule = useWcStore((e) => e.setRule);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMounted === true) {
      return;
    }
    // 기본 룰일 때
    const ruleForm = sampleRules.find((e) => e.metadata?.id === rule);
    if (ruleForm) {
      setRule(ruleForm);
      setIsMounted(true);
      return;
    }

    // 저장소 내 룰일때 (구현 중)

    // 룰이 없을 때
    navigate("/home");
  }, [setRule, isMounted, navigate]);

  return isMounted;
};
