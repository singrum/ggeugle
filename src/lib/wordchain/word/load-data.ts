import { removeDup } from "@/lib/utils";

import { cates, dicts, poses } from "@/constants/rule";
import type { WordRule } from "@/types/rule";

async function fetchWords(url: string) {
  const fetchOptions = { cache: "force-cache" as RequestCache };
  const response =
    url === "https://singrum.github.io/KoreanDict/oldict/db/명사"
      ? await fetch("/dict/guel.txt", fetchOptions)
      : await fetch(url, fetchOptions);

  const text = await response.text();

  const result = text.split("\n").map((x) => x.trim());

  return result;
}

export async function loadWords(wordRule: WordRule): Promise<string[]> {
  const { addedWords, removedWords, regexFilter, words } = wordRule;

  let wordArr: string[];
  if (words.type === "manual") {
    wordArr = words.option.content.split("\n").map((x) => x.trim());
  } else {
    const filter = words.option;
    const urlFunc = dicts[filter.dict].urlFunction;
    const targetPoses = poses.filter((e) => filter.pos[e]);
    const targetCates = cates.filter((e) => filter.cate[e]);
    const targetUrls = [
      ...new Set(
        targetPoses
          .map((pos) => targetCates.map((cate) => urlFunc(pos, cate)))
          .flat(),
      ),
    ];

    wordArr = (
      await Promise.all(targetUrls.map(async (url) => await fetchWords(url)))
    ).flat();
  }

  wordArr.push(...addedWords.split(/\s+/));
  const removedWordsSet = new Set(removedWords.split(/\s+/));
  wordArr = wordArr.filter((e) => !removedWordsSet.has(e));
  const re = new RegExp(`^${regexFilter}$`);
  wordArr = removeDup(wordArr.filter((x) => re.test(x) && x.length >= 1));

  return wordArr;
}
