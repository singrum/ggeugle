import * as Hangul from "hangul-js";

import { assembleHangul } from "es-hangul";

const char2code = (char: string) => char.charCodeAt(0);
const code2char = (code: number) => String.fromCharCode(code);

const cho = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const jung = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const jong = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const ga = 44032;

export function disassemble(char: string): (string | undefined)[] {
  let uni = char2code(char);
  if (uni >= char2code("ㄱ") && uni <= char2code("ㅎ")) {
    return [char, undefined, undefined];
  } else if (uni >= char2code("ㅏ") && uni <= char2code("ㅣ")) {
    return [undefined, char, undefined];
  }
  uni = uni - ga;
  let fn = Math.floor(uni / 588);
  let sn = Math.floor((uni - fn * 588) / 28);
  let tn = uni % 28;
  return [cho[fn], jung[sn], jong[tn]];
}

const banjeonMap: { [key: string]: string } = {
  ㅏ: "ㅓ",
  ㅑ: "ㅕ",
  ㅓ: "ㅏ",
  ㅕ: "ㅑ",
  ㅗ: "ㅜ",
  ㅛ: "ㅠ",
  ㅜ: "ㅗ",
  ㅠ: "ㅛ",
};

function noDu(char: string) {
  return [char];
}
const noDu_rev = noDu;

function std(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [char, assembleHangul(["ㅇ", jung!, jong!])];
  else if (cho === "ㄹ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [char, assembleHangul(["ㄴ", jung!, jong!])];
  else if (cho === "ㄴ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!))
    return [char, assembleHangul(["ㅇ", jung!, jong!])];
  else return [char];
}
function std_rev(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㅇ" && ["ㅑ", "ㅖ"].includes(jung!))
    return [char, assembleHangul(["ㄹ", jung!, jong!])];
  else if (cho === "ㄴ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [char, assembleHangul(["ㄹ", jung!, jong!])];
  else if (cho === "ㅇ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!))
    return [
      char,
      assembleHangul(["ㄴ", jung!, jong!]),
      assembleHangul(["ㄹ", jung!, jong!]),
    ];
  else return [char];
}

function oneWay(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ")
    return [
      char,
      assembleHangul(["ㄴ", jung!, jong!]),
      assembleHangul(["ㅇ", jung!, jong!]),
    ];
  else if (cho === "ㄴ") return [char, assembleHangul(["ㅇ", jung!, jong!])];
  else return [char];
}
function oneWay_rev(char: string) {
  const [cho, jung, jong] = disassemble(char);

  if (cho === "ㅇ")
    return [
      char,
      assembleHangul(["ㄴ", jung!, jong!]),
      assembleHangul(["ㄹ", jung!, jong!]),
    ];
  else if (cho === "ㄴ") return [char, assembleHangul(["ㄹ", jung!, jong!])];
  else return [char];
}

function twoWay(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ")
    return [
      assembleHangul(["ㄹ", jung!, jong!]),
      assembleHangul(["ㄴ", jung!, jong!]),
      assembleHangul(["ㅇ", jung!, jong!]),
    ];
  else return [char];
}
const twoWay_rev = twoWay;

function banjeon(char: string) {
  const [cho, jung, jong] = disassemble(char);
  const result = std(char);

  if (jung && jung in banjeonMap)
    result.push(assembleHangul([cho!, banjeonMap[jung], jong!]));

  return result;
}
const banjeon_rev = banjeon;

function chanRule(char: string) {
  const [cho, jung, jong] = disassemble(char);

  if (cho && jong && Hangul.isJong(cho) && Hangul.isCho(jong))
    return [char, assembleHangul([jong, jung!, cho])];
  else return [char];
}
const chanRule_rev = chanRule;

function dpRule(char: string) {
  const [cho, jung, jong] = disassemble(char);
  let choChan: (string | undefined)[];

  if (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ") {
    choChan = ["ㄹ", "ㄴ", "ㅇ"];
  } else {
    choChan = [cho];
  }
  let jongChan: (string | undefined)[];
  if (jong === "ㄹ" || jong === "ㄴ" || jong === "ㅇ") {
    jongChan = ["ㄹ", "ㄴ", "ㅇ"];
  } else {
    jongChan = [jong];
  }

  let result: string[] = [];
  for (let chan1 of choChan) {
    for (let chan2 of jongChan) {
      result.push(assembleHangul([chan1!, jung!, chan2!]));
    }
  }
  return result;
}
const dpRule_rev = dpRule;

function forceStd(char: string) {
  const stdChan = std(char);
  if (stdChan.length >= 2) return stdChan.slice(1);
  else return stdChan;
}
function forceStd_rev(char: string) {
  const [cho, jung, _] = disassemble(char);
  const stdRevChan = std_rev(char);
  if (stdRevChan.length >= 2) return stdRevChan;
  else if (cho === "ㄹ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [];
  else if (cho === "ㄹ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [];
  else if (cho === "ㄴ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!)) return [];
  else return stdRevChan;
}

const revStd = std_rev;
const revStd_rev = std;

function forceRevStd(char: string) {
  const revStdChan = revStd(char);
  if (revStdChan.length >= 2) return revStdChan.slice(1);
  else return revStdChan;
}
function forceRevStd_rev(char: string) {
  const [cho, jung, _] = disassemble(char);
  const revStdRevChan = revStd_rev(char);
  if (revStdRevChan.length >= 2) return revStdRevChan;
  else if (cho === "ㅇ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [];
  else if (cho === "ㄴ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [];
  else if (cho === "ㅇ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!)) return [];
  else return revStdRevChan;
}
export const changeableMap: ((char: string) => string[])[] = [
  // 0 : 없음
  noDu,
  // 1 : 표준
  std,
  // 2 : 강제표준두음
  forceStd,
  // 3 : 역표준두음
  revStd,
  // 4 : 강제역표준두음
  forceRevStd,
  // 5 : ㄹ->ㄴ->ㅇ
  oneWay,
  // 6 : ㄹ<->ㄴ<->ㅇ
  twoWay,
  // 7 : 반전룰
  banjeon,
  // 8 : 챈룰
  chanRule,
  // 9 : 듭2룰
  dpRule,
];

export const reverseChangeableMap: ((char: string) => string[])[] = [
  // 0 : 없음
  noDu_rev,
  // 1 : 표준
  std_rev,
  // 2 : 강제표준두음
  forceStd_rev,
  // 3 : 역표준두음
  revStd_rev,
  // 4 : 강제역표준두음
  forceRevStd_rev,
  // 5 : ㄹ->ㄴ->ㅇ
  oneWay_rev,
  // 6 : ㄹ<->ㄴ<->ㅇ
  twoWay_rev,
  // 7 : 반전룰
  banjeon_rev,
  // 8 : 챈룰
  chanRule_rev,
  // 9 : 듭2룰
  dpRule_rev,
];
