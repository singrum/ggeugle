import { OutlineCard } from "@/components/outline-card";
import { downloadActionData } from "@/constants/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, downloadText } from "@/lib/utils";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { Braces, FileText } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import {
  DownloadActionButton,
  DownloadActionGroup,
  DownloadSection,
  DownloadTitle,
} from "./download-section";

// 전체 단어 목록
// 전체 음절 목록

// 공격 단어
// 필수 공격 단어
// 방어 단어

// 루트 단어
export default function Download({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const isMobile = useIsMobile();
  return (
    <div className="space-y-4">
      {downloadActionData.map((group, i) => (
        <OutlineCard key={i} className="gap-0 p-0 sm:p-0">
          {group.map(({ title, action }, i) => (
            <Fragment key={title}>
              <DownloadSection>
                <DownloadTitle last={i === group.length - 1}>
                  {title}
                </DownloadTitle>

                <DownloadActionGroup>
                  <DownloadActionButton
                    className={cn({ "rounded-full": isMobile })}
                    onClick={() => {
                      downloadText(title, action.getJson(solver, view));
                    }}
                  >
                    <Braces />
                    {!isMobile && "JSON"}
                  </DownloadActionButton>
                  <DownloadActionButton
                    className={cn({ "rounded-full": isMobile })}
                    onClick={() => {
                      downloadText(title, action.getText(solver, view));
                    }}
                  >
                    <FileText />
                    {!isMobile && "텍스트"}
                  </DownloadActionButton>
                </DownloadActionGroup>
              </DownloadSection>
            </Fragment>
          ))}
        </OutlineCard>
      ))}
    </div>
  );
}
