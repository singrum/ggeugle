import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useWcStore } from "@/stores/wc-store";
import { useState } from "react";
const regexExamples = [
  {
    title: "모든 단어",
    content: String.raw`.*`,
  },
  {
    title: "'가'로 시작하지 않는 단어",
    content: String.raw`[^가].*`,
  },
  {
    title: "'가'또는 '나'로 시작하지 않는 단어",
    content: String.raw`[^가나].*`,
  },
  {
    title: "'가'로 끝나지 않는 단어",
    content: String.raw`.*[^가]`,
  },
  {
    title: "'가'와 '나'로 끝나지 않는 단어",
    content: String.raw`.*[^가나]`,
  },
  {
    title: "'가'를 포함하는 단어",
    content: String.raw`.*[가].*`,
  },
  {
    title: "'가' 또는 '나'를 포함하는 단어",
    content: String.raw`.*[가나].*`,
  },
  {
    title: "'가'를 포함하지 않는 단어",
    content: String.raw`[^가]*`,
  },
  {
    title: "'가'와 '나'를 포함하지 않는 단어",
    content: String.raw`[^가나]*`,
  },
  {
    title: "첫 글자와 끝 글자가 다른 단어",
    content: String.raw`(.).*(?!\1).`,
  },
  {
    title: "3글자 단어",
    content: String.raw`(.{3})`,
  },
  {
    title: "2글자 또는 5글자 단어",
    content: String.raw`(.{2}|.{5})`,
  },
  {
    title: "3글자 이상 단어",
    content: String.raw`(.{3}).*`,
  },
  {
    title: "4글자 이하 단어",
    content: String.raw`.{0,4}`,
  },
  {
    title: "짝수 글자 단어",
    content: String.raw`(..)*`,
  },
  {
    title: "홀수 글자 단어",
    content: String.raw`.(..)*`,
  },
  {
    title: "ab를 제외한 단어",
    content: String.raw`(?!(ab)$).*`,
  },
  {
    title: "ab, cd, ef를 제외한 단어",
    content: String.raw`(?!(ab|cd|ef)$).*`,
  },
];
export default function RegexExamples() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Accordion type="single" className="w-full" collapsible={true}>
      <AccordionItem value={`item`}>
        <AccordionTrigger onClick={() => setIsOpen(!isOpen)} className="py-2">
          Regex 예시 보기
        </AccordionTrigger>
        <AccordionContent className="w-full max-w-xl overflow-hidden pt-2">
          {regexExamples.map(({ title, content }) => (
            <Button
              onClick={() => {
                useWcStore.setState((state) => {
                  state.localRule.wordRule.regexFilter = content;
                });
              }}
              key={title}
              className="hover:bg-accent/50 flex w-full justify-between rounded-none px-0 font-normal"
              variant="ghost"
            >
              <div>{title}</div>
              <code className="bg-muted w-fit rounded px-2 py-1 text-sm">
                {content}
              </code>
            </Button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
