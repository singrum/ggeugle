import { RuleForm } from "../store/useWC";
import { getNextWords } from "./algorithms";
import { cates, poses } from "./rules";
import {
  removeHeadTailDuplication,
  WCDisplay,
  WCEngine,
  WCRule,
} from "./WordChain";

async function fetchWords(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  const result = text.split("\n").map((x) => x.trim());

  return result;
}

export async function getEngine(ruleForm: RuleForm) {
  let words: string[] = [];
  if (typeof ruleForm.dict === "object") {
    words = ruleForm.dict.uploadedDict.split("\n").map((x) => x.trim());
  } else {
    switch (ruleForm.dict) {
      case 0:
        words = (
          await Promise.all(
            poses
              .filter((_, i) => ruleForm.pos[i])
              .map((pos) =>
                fetchWords(
                  `https://singrum.github.io/KoreanDict/oldict/db/${pos}`
                )
              )
          )
        ).flat();

        break;
      case 1:
        words = (
          await Promise.all(
            poses
              .filter((_, i) => ruleForm.pos[i])
              .map((pos) =>
                fetchWords(
                  `https://singrum.github.io/KoreanDict/stdict/db/${pos}`
                )
              )
          )
        ).flat();
        break;
      case 2:
        const pairs = [];
        for (let cate of cates.filter((_, i) => ruleForm.cate[i]))
          for (let pos of poses.filter((_, i) => ruleForm.pos[i]))
            pairs.push([cate, pos]);

        words = (
          await Promise.all(
            pairs.map((e) =>
              fetchWords(
                `https://singrum.github.io/KoreanDict/opendict/db/${e[0]}/${e[1]}`
              )
            )
          )
        ).flat();

        break;
      case 3:
        words = (
          await Promise.all(
            poses
              .filter((_, i) => ruleForm.pos[i])
              .map((pos) =>
                fetchWords(
                  `https://singrum.github.io/KoreanDict/naverdict/db/${pos}`
                )
              )
          )
        ).flat();
        break;
      case 4:
        words = await fetchWords(
          `https://singrum.github.io/KoreanDict/kkutu/db/노인정`
        );
        break;
      case 5:
        words = await fetchWords(
          `https://singrum.github.io/KoreanDict/kkutu/db/어인정`
        );

        break;
    }
  }
  console.log("데이터 로드 완료");

  let r: WCRule = {
    changeableIdx: ruleForm.chan,
    headIdx: ruleForm.headDir === 0 ? ruleForm.headIdx - 1 : -ruleForm.headIdx,
    tailIdx: ruleForm.tailDir === 0 ? ruleForm.tailIdx - 1 : -ruleForm.tailIdx,
    manner: ruleForm.manner,
  };
  let wce = new WCEngine(r);

  const re = new RegExp(`^${ruleForm.regexFilter}$`);

  wce.words = Array.from(
    new Set(
      words
        .filter((x) => re.test(x) && x.length >= 1)
        .concat(ruleForm.addedWords1.split(/\s+/).filter((e) => e.length >= 1))
    )
  );

  if (ruleForm.removeHeadTailDuplication) {
    wce.words = removeHeadTailDuplication(
      wce.words,
      wce.rule.headIdx,
      wce.rule.tailIdx
    );
  }

  wce.update();

  if (r.manner === 1) {
    const mannerWords = wce.words.filter((e) => {
      const temp = wce.chanGraph.nodes[e.at(wce.rule.tailIdx)!];

      return !(temp.endNum === 0 && temp.type === "los");
    });
    wce = new WCEngine(r);
    wce.words = mannerWords;
    wce.update();
  }

  if (r.manner === 2) {
    while (1) {
      const mannerWords = wce.words.filter((e) => {
        const temp = wce.chanGraph.nodes[e.at(wce.rule.tailIdx)!];

        return !(temp.endNum === 0 && temp.type === "los");
      });

      if (mannerWords.length === wce.words.length) {
        break;
      }
      wce = new WCEngine(r);
      wce.words = mannerWords;
      wce.update();
    }
  }

  const addedWords2 = ruleForm.addedWords2
    .split(/\s+/)
    .filter((x) => x.length >= 1);

  if (addedWords2.length > 0) {
    const temp = Array.from(new Set(wce.words.concat(addedWords2)));
    wce = new WCEngine(r);
    wce.words = temp;
    wce.update();
  }

  console.log("음절 분류 완료");

  return wce;
}

export function getWordsCsv(wce: WCEngine) {
  const chars = Object.keys(wce.wordGraph.nodes);

  const winWords = new Set();
  const wordSortKey: Record<string, number> = {};
  const nextWordsMap = chars.forEach((char) => {
    let {
      win,
      route,
      return: returning,
      los,
    } = WCDisplay.searchResult(wce, char, false)?.result.startsWith;
    for (let { endNum, words } of win) {
      for (let word of words) {
        wordSortKey[word] = parseInt(endNum / 2);
        winWords.add(word);
      }
    }
    for (let { endNum, words } of los) {
      for (let word of words) {
        wordSortKey[word] = 2000 - parseInt(endNum / 2);
      }
    }
    route.forEach((e) => {
      return (wordSortKey[e] =
        50 +
        getNextWords(wce.chanGraph, wce.wordGraph, e.at(wce.rule.tailIdx))
          .length);
    });
    returning.forEach((e) => (wordSortKey[e] = 1000));
  });
  console.log(wordSortKey);
  const data = [["word", "head", "tail", "sort_key", "is_win"]];
  for (const word in wordSortKey) {
    data.push([
      word,
      word.at(wce.rule.headIdx),
      word.at(wce.rule.tailIdx),
      wordSortKey[word],
      winWords.has(word),
    ]);
  }

  console.log(data);

  const csvContent = data.map((row) => row.join(",")).join("\n");

  // Blob 객체 생성
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // 다운로드 링크 생성
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "example.csv"; // 파일 이름 설정
  document.body.appendChild(a);
  a.click(); // 다운로드 실행

  // 메모리 해제
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
