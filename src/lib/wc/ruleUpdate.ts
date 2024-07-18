import { RuleForm } from "../store/useWC";
import { WCengine, Rule, LOS, WIN, WINCIR, LOSCIR, ROUTE } from "./WordChain";

function decode(params: RuleForm) {
  const map: {
    pos: string[];
    cate: string[];
    len: number[];
  } = {
    pos: [
      "명사",
      "의존명사",
      "대명사",
      "수사",
      "부사",
      "관형사",
      "감탄사",
      "구",
    ],
    cate: ["일반어", "방언", "북한어", "옛말"],
    len: [2, 3, 4, 5, 6, 7, 8, 9, -1],
  };
  const result: {
    dict: number;
    chan: number;
    pos: string[];
    cate: string[];
    len: number[];
    manner: boolean;
    regexFilter: RegExp;
    addedWords: string[];
    headDir: 0 | 1;
    tailDir: 0 | 1;
    headIdx: number;
    tailIdx: number;
  } = {
    ...params,
    pos: params.pos.reduce((prev: string[], curr, idx) => {
      if (curr) {
        prev.push(map.pos[idx]);
      }
      return prev;
    }, []),
    cate: params.cate.reduce((prev: string[], curr, idx) => {
      if (curr) {
        prev.push(map.cate[idx]);
      }
      return prev;
    }, []),
    len: params.len.reduce((prev: number[], curr, idx) => {
      if (curr) {
        prev.push(map.len[idx]);
      }
      return prev;
    }, []),
    regexFilter: new RegExp(`^${params.regexFilter}$`),
    addedWords: params.addedWords.split(/\s+/).filter((e) => e.length > 0),
  };

  return result;
}

async function makeWordList(url: string) {
  let response = await fetch(url);
  let text = await response.text();
  return text.split("\n").map((x) => x.trim());
}

export async function getEngine(rule: RuleForm) {
  const params = decode(rule);

  let wordList: string[] = [];
  if (params.dict == 0) {
    const wordLists = await Promise.all(
      params.pos.map((pos) =>
        makeWordList(
          `https://singrum.github.io/KoreanDict/oldict/db/${encodeURI(pos)}`
        )
      )
    );
    wordList = wordLists.reduce((a, b) => a.concat(b), []);
  } else if (params.dict == 1) {
    let wordLists = [];
    for (let cate of params.cate) {
      for (let pos of params.pos) {
        wordLists.push(
          makeWordList(
            `https://singrum.github.io/KoreanDict/opendict/db/${cate}/${encodeURI(
              pos
            )}`
          )
        );
      }
    }
    wordLists = await Promise.all(wordLists);
    wordList = wordLists.reduce((a, b) => a.concat(b), []);
  } else if (params.dict == 3) {
    const wordLists = await Promise.all(
      params.pos.map((pos) =>
        makeWordList(
          `https://singrum.github.io/KoreanDict/stdict/db/${encodeURI(pos)}`
        )
      )
    );
    wordList = wordLists.reduce((a, b) => a.concat(b), []);
  }
  console.log("데이터 로드 완료");
  const lenFilter = (w: string) => {
    for (let e of params.len) {
      if ((e === -1 && w.length >= 10) || w.length === e) {
        return true;
      }
    }
    return false;
  };

  let r = new Rule(
    params.chan,
    params.headDir === 0 ? params.headIdx - 1 : -params.headIdx,
    params.tailDir === 0 ? params.tailIdx - 1 : -params.tailIdx,
    params.manner
  );
  let wm = new WCengine(r);

  wm.word_list = Array.from(
    new Set(
      wordList
        .filter((x) => x && lenFilter(x))
        .filter((x) => params.regexFilter.test(x))
        .concat(params.addedWords)
    )
  );

  wm.update();
  wm.getRouteComp();

  return wm;
}
