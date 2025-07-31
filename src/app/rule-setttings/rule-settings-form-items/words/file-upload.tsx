import { CardTitle } from "@/components/ui/card";

import { useWcStore } from "@/stores/wc-store";
import type { ManualWordsOption } from "@/types/rule";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { File } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";
function getWordsFromUploadedDict(text: string) {
  return text.split(/\s+/).map((x) => x.trim());
}
export default function FileUpload() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
  });
  const content = useWcStore(
    (e) => (e.localRule.wordRule.words.option as ManualWordsOption).content,
  );

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles[0].text().then((e) => {
        useWcStore.setState((state) => {
          if (state.localRule.wordRule.words.type === "manual") {
            state.localRule.wordRule.words.option.content = e;
          }
        });
      });
    }
  }, [acceptedFiles]);

  const words = useMemo(() => {
    if (content) {
      const words = getWordsFromUploadedDict(content);

      return words;
    }
  }, [content]);

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>파일 업로드</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <section className="w-full">
          <div
            {...getRootProps({
              className:
                "bg-muted dark:bg-muted/50 rounded-lg text-foreground h-48 overflow-auto px-4 py-2",
            })}
          >
            <div className="flex h-full w-full cursor-default flex-col items-center justify-center gap-2 select-none">
              <File className="text-muted-foreground h-8 w-8" />
              <p className="font-medium">
                클릭하거나 파일을 이곳에 끌어다 놓으세요.
              </p>
              <div className="text-center text-sm">
                <p className="text-muted-foreground font-normal">
                  텍스트 파일만 인식하며, 단어는 공백으로 구분됩니다.
                </p>
              </div>
            </div>

            <input {...getInputProps()} />
          </div>
          {words && (
            <div className="w-full">
              <div className="mt-4 pb-1 text-sm font-medium">
                미리 보기{" "}
                <span className="text-muted-foreground">
                  ({words.length.toLocaleString()} 단어)
                </span>
              </div>
              <ScrollArea className="h-72 w-full max-w-full min-w-0 overflow-auto rounded-lg border-none">
                {words.slice(0, 99).map((e, i) => (
                  <div key={i} className="flex">
                    <div className="text-muted-foreground w-10 shrink-0 pr-4 text-right">
                      {i + 1}
                    </div>
                    <div className="">{e}</div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </section>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
