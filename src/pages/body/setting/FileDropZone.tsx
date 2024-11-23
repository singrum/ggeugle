import { useWC } from "@/lib/store/useWC";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { File } from "lucide-react";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
function getWordsFromUploadedDict(text: string) {
  return text.split("\n").map((x) => x.trim());
}
export function FileDropZone() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
  });
  const [ruleForm, setRuleForm] = useWC((e) => [e.ruleForm, e.setRuleForm]);
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles[0]
        .text()
        .then((e) => setRuleForm({ ...ruleForm, dict: { uploadedDict: e } }));
    }
  }, [acceptedFiles]);
  return (
    <section className="">
      <div
        {...getRootProps({
          className:
            "border border-border rounded-lg text-foreground h-48 overflow-auto px-4 py-2",
        })}
      >
        {typeof ruleForm.dict !== "object" || (
          <div className="h-full w-full flex flex-col justify-center items-center gap-2 cursor-pointer seelct-none">
            <File className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">
              클릭 또는 파일을 이곳에 드래그 하세요.
            </p>
            <div className="text-sm text-center">
              <p className="text-muted-foreground font-normal">
                텍스트 파일만 인식 가능하며 각 단어는 줄바꿈으로 구분됩니다.
              </p>
            </div>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
      {typeof ruleForm.dict === "object" &&
        ruleForm.dict.uploadedDict.length > 0 && (
          <>
            <div className="font-medium pb-1 text-sm mt-4">
              미리 보기{" "}
              <span className="text-muted-foreground">
                (
                {getWordsFromUploadedDict(
                  ruleForm.dict.uploadedDict
                ).length.toLocaleString()}{" "}
                단어)
              </span>
            </div>
            <ScrollArea className="h-72 w-full min-w-0 rounded-lg border p-4 overflow-auto">
              {getWordsFromUploadedDict(ruleForm.dict.uploadedDict)
                .slice(0, 99)
                .map((e, i) => (
                  <div key={i} className="flex">
                    <div className="text-muted-foreground pr-4 w-10 text-right">
                      {i + 1}
                    </div>
                    {e}
                  </div>
                ))}
            </ScrollArea>
          </>
        )}
    </section>
  );
}
