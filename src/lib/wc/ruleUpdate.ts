import { RuleForm } from "../store/useWC";
import { cates, poses } from "./rules";
import { WCEngine, WCRule } from "./WordChain";

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
        .filter((x) => re.test(x) && x.length > 1)
        .concat(ruleForm.addedWords1.split(/\s+/).filter((e) => e.length > 1))
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
    .filter((x) => x.length > 1);

  if (addedWords2.length > 0) {
    const temp = Array.from(new Set(wce.words.concat(addedWords2)));
    wce = new WCEngine(r);
    wce.words = temp;
    wce.update();
  }

  console.log("음절 분류 완료");

  return wce;
}

function removeHeadTailDuplication(
  words: string[],
  headIdx: number,
  tailIdx: number
) {
  const cache: Set<string> = new Set();
  const result = [];
  for (const word of words) {
    const head = word.at(headIdx)!;
    const tail = word.at(tailIdx)!;
    const reducedWord = head.concat(tail);
    if (cache.has(reducedWord)) {
      continue;
    } else {
      cache.add(reducedWord);
    }
    result.push(word);
  }

  return result;
}
