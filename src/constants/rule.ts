import { toObject } from "@/lib/utils";
import type { Cate, Pos } from "@/types/rule";
export const poses = [
  "명사",
  "의존명사",
  "대명사",
  "수사",
  "부사",
  "관형사",
  "감탄사",
  "구",
  "무품사",
];
export const cates = ["일반어", "방언", "북한어", "옛말"];
export const manners = [
  "제거 안 함",
  "한 번만 제거",
  "모두 제거",
  "다음 단어 개수 제한",
];
export const dicts: {
  title: string;
  urlFunction: (pos: Pos, cate: Cate) => string;
  activePos: Record<Pos, 0 | 1>;
  defaultPos: Record<Pos, 0 | 1>;
  activeCate: Record<Cate, 0 | 1>;
  defaultCate: Record<Cate, 0 | 1>;
}[] = [
  {
    title: "(구)표준국어대사전",
    urlFunction: (pos: Pos) =>
      `https://singrum.github.io/KoreanDict/oldict/db/${pos}`,
    activePos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
    defaultPos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
    activeCate: toObject(cates, [0, 0, 0, 0]),
    defaultCate: toObject(cates, [1, 1, 1, 1]),
  },
  {
    title: "(신)표준국어대사전",
    urlFunction: (pos: Pos) =>
      `https://singrum.github.io/KoreanDict/stdict/db/${pos}`,
    activePos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
    defaultPos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
    activeCate: toObject(cates, [0, 0, 0, 0]),
    defaultCate: toObject(cates, [1, 0, 0, 0]),
  },
  {
    title: "우리말샘",
    urlFunction: (pos: Pos, cate: Cate) =>
      `https://singrum.github.io/KoreanDict/opendict/db/${cate}/${pos}`,
    activePos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 0]),
    defaultPos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
    activeCate: toObject(cates, [1, 1, 1, 1]),
    defaultCate: toObject(cates, [1, 1, 1, 1]),
  },
  {
    title: "네이버 국어사전",
    urlFunction: (pos: Pos) =>
      `https://singrum.github.io/KoreanDict/naverdict/db/${pos}`,
    activePos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 0, 0]),
    defaultPos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
    activeCate: toObject(cates, [0, 0, 0, 0]),
    defaultCate: toObject(cates, [1, 1, 1, 1]),
  },
  {
    title: "끄투코리아 노인정",
    urlFunction: () => `https://singrum.github.io/KoreanDict/kkutu/db/노인정`,
    activePos: toObject(poses, [0, 0, 0, 0, 0, 0, 0, 0, 0]),
    defaultPos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
    activeCate: toObject(cates, [0, 0, 0, 0]),
    defaultCate: toObject(cates, [1, 1, 1, 1]),
  },
  {
    title: "끄투코리아 어인정",
    urlFunction: () => `https://singrum.github.io/KoreanDict/kkutu/db/어인정`,
    activePos: toObject(poses, [0, 0, 0, 0, 0, 0, 0, 0, 0]),
    defaultPos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
    activeCate: toObject(cates, [0, 0, 0, 0]),
    defaultCate: toObject(cates, [1, 1, 1, 1]),
  },
];

export const kkutuInfo: {
  gameType: string[];
  manner: string[];
  injeong: string[];
} = {
  gameType: ["끝말잇기", "쿵쿵따", "앞말잇기"],
  manner: ["노매너", "매너", "젠틀"],
  injeong: ["노인정", "어인정"],
};
