import { cates, poses, RuleForm } from "../store/useWC";
import { WCEngine, WCRule } from "./WordChain";

async function fetchWords(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  const result = text.split("\n").map((x) => x.trim());

  return result;
}

export async function getEngine(ruleForm: RuleForm) {
  let words: string[] = [];

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
      words = (await Promise.all([
        fetchWords(`https://singrum.github.io/KoreanDict/kkutu/db/노인정`),
        fetchWords(`https://singrum.github.io/KoreanDict/kkutu/db/어인정`),
      ])).flat();
      break;
    case 6:
      const pairs_ = [];

      for (let cate of cates)
        for (let pos of poses.slice(0, poses.length - 1))
          pairs_.push([cate, pos]);

      words = (
        await Promise.all([
          fetchWords(`https://singrum.github.io/KoreanDict/kkutu/db/어인정`),
          ...pairs_.map((e) =>
            fetchWords(
              `https://singrum.github.io/KoreanDict/opendict/db/${e[0]}/${e[1]}`
            )
          ),
        ])
      ).flat();
      break;
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
        .concat(ruleForm.addedWords.split(/\s+/).filter((e) => e.length > 0))
    )
  );

  wce.update();
  if (r.manner) {
    const mannerWords = wce.words.filter((e) => {
      const temp = wce.chanGraph.nodes[e.at(wce.rule.tailIdx)!];

      return !(temp.endNum === 0 && temp.type === "los");
    });
    wce = new WCEngine(r);
    wce.words = mannerWords;
    wce.update();
  }

  console.log("음절 분류 완료");

  return wce;
}
