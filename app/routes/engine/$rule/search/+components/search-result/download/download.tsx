import { Braces, FileText } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { downloadActionData } from "~/constants/search";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn, downloadText } from "~/lib/utils";
import type { WordSolver } from "~/lib/wordchain/word/word-solver";
import { OutlineCard } from "~/routes/engine/$rule/+components/outline-card";
import { useWcStore } from "~/stores/wc-store-provider";
import {
  DownloadActionButton,
  DownloadActionGroup,
  DownloadSection,
  DownloadTitle,
} from "./download-section";

export default function Download({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const isMobile = useIsMobile();
  const prec = useWcStore((e) => e.prec);
  return (
    <div className="space-y-4">
      {downloadActionData.map((group, i) => (
        <OutlineCard key={i} className="gap-0 p-0 sm:p-0 border">
          {group.map(({ title, action }, i) => (
            <Fragment key={title}>
              <DownloadSection>
                <DownloadTitle last={i === group.length - 1}>
                  {title}
                </DownloadTitle>

                <DownloadActionGroup>
                  {action.getJson && (
                    <DownloadActionButton
                      className={cn({ "rounded-full": isMobile })}
                      onClick={() => {
                        downloadText(title, action.getJson!(solver, view));
                      }}
                    >
                      <Braces />
                      {!isMobile && "JSON"}
                    </DownloadActionButton>
                  )}
                  {action.getText && (
                    <DownloadActionButton
                      className={cn({ "rounded-full": isMobile })}
                      onClick={() => {
                        downloadText(
                          title,
                          action.getText!(solver, view, prec),
                        );
                      }}
                    >
                      <FileText />
                      {!isMobile && "텍스트"}
                    </DownloadActionButton>
                  )}
                </DownloadActionGroup>
              </DownloadSection>
            </Fragment>
          ))}
        </OutlineCard>
      ))}
    </div>
  );
}
