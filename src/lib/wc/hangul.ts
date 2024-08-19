import * as Hangul from "hangul-js";

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

export function getConstantVowel(char: string) {
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

export const changeableMap: ((char: string) => string[])[] = [
  function (char: string) {
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (
      (code >= char2code("랴") && code <= char2code("럏")) ||
      (code >= char2code("려") && code <= char2code("렿")) ||
      (code >= char2code("료") && code <= char2code("룧")) ||
      (code >= char2code("류") && code <= char2code("륳")) ||
      (code >= char2code("리") && code <= char2code("맇")) ||
      (code >= char2code("례") && code <= char2code("롛"))
    )
      return [char, code2char(code + char2code("아") - char2code("라"))];
    else if (
      (code >= char2code("라") && code <= char2code("랗")) ||
      (code >= char2code("래") && code <= char2code("랳")) ||
      (code >= char2code("로") && code <= char2code("롷")) ||
      (code >= char2code("루") && code <= char2code("뤃")) ||
      (code >= char2code("르") && code <= char2code("릏")) ||
      (code >= char2code("뢰") && code <= char2code("룋"))
    )
      return [char, code2char(code + char2code("나") - char2code("라"))];
    else if (
      (code >= char2code("녀") && code <= char2code("녛")) ||
      (code >= char2code("뇨") && code <= char2code("눃")) ||
      (code >= char2code("뉴") && code <= char2code("늏")) ||
      (code >= char2code("니") && code <= char2code("닣"))
    )
      return [char, code2char(code + char2code("아") - char2code("나"))];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (code >= char2code("라") && code <= char2code("맇"))
      return [
        char,
        code2char(code + char2code("나") - char2code("라")),
        code2char(code + char2code("아") - char2code("라")),
      ];
    else if (code >= char2code("나") && code <= char2code("닣"))
      return [char, code2char(code + char2code("아") - char2code("나"))];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (code >= char2code("라") && code <= char2code("맇"))
      return [
        char,
        code2char(code + char2code("나") - char2code("라")),
        code2char(code + char2code("아") - char2code("라")),
      ];
    else if (code >= char2code("나") && code <= char2code("닣"))
      return [
        char,
        code2char(code + char2code("라") - char2code("나")),
        code2char(code + char2code("아") - char2code("나")),
      ];
    else if (code >= char2code("아") && code <= char2code("잏"))
      return [
        char,
        code2char(code + char2code("라") - char2code("아")),
        code2char(code + char2code("나") - char2code("아")),
      ];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    let result = [char];
    if (
      (code >= char2code("랴") && code <= char2code("럏")) ||
      (code >= char2code("려") && code <= char2code("렿")) ||
      (code >= char2code("료") && code <= char2code("룧")) ||
      (code >= char2code("류") && code <= char2code("륳")) ||
      (code >= char2code("리") && code <= char2code("맇")) ||
      (code >= char2code("례") && code <= char2code("롛"))
    )
      result.push(code2char(code + char2code("아") - char2code("라")));
    else if (
      (code >= char2code("라") && code <= char2code("랗")) ||
      (code >= char2code("래") && code <= char2code("랳")) ||
      (code >= char2code("로") && code <= char2code("롷")) ||
      (code >= char2code("루") && code <= char2code("뤃")) ||
      (code >= char2code("르") && code <= char2code("릏")) ||
      (code >= char2code("뢰") && code <= char2code("룅"))
    )
      result.push(code2char(code + char2code("나") - char2code("라")));
    else if (
      (code >= char2code("녀") && code <= char2code("녛")) ||
      (code >= char2code("뇨") && code <= char2code("눃")) ||
      (code >= char2code("뉴") && code <= char2code("늏")) ||
      (code >= char2code("니") && code <= char2code("닣"))
    )
      result.push(code2char(code + char2code("아") - char2code("나")));

    let disassembled = getConstantVowel(char);

    let jung = disassembled[1];

    if (jung && jung in banjeonMap) {
      disassembled[1] = banjeonMap[jung];
      // console.log(disassembled, char);
      result.push(Hangul.assemble(disassembled));
    }
    return result;
  },
  function (char: string) {
    let code = char2code(char);
    let result = [char];
    if (
      (code >= char2code("랴") && code <= char2code("럏")) ||
      (code >= char2code("려") && code <= char2code("렿")) ||
      (code >= char2code("료") && code <= char2code("룧")) ||
      (code >= char2code("류") && code <= char2code("륳")) ||
      (code >= char2code("리") && code <= char2code("맇")) ||
      (code >= char2code("례") && code <= char2code("롛"))
    )
      result.push(code2char(code + char2code("아") - char2code("라")));
    else if (
      (code >= char2code("라") && code <= char2code("랗")) ||
      (code >= char2code("래") && code <= char2code("랳")) ||
      (code >= char2code("로") && code <= char2code("롷")) ||
      (code >= char2code("루") && code <= char2code("뤃")) ||
      (code >= char2code("르") && code <= char2code("릏")) ||
      (code >= char2code("뢰") && code <= char2code("룅"))
    )
      result.push(code2char(code + char2code("나") - char2code("라")));
    else if (
      (code >= char2code("녀") && code <= char2code("녛")) ||
      (code >= char2code("뇨") && code <= char2code("눃")) ||
      (code >= char2code("뉴") && code <= char2code("늏")) ||
      (code >= char2code("니") && code <= char2code("닣"))
    )
      result.push(code2char(code + char2code("아") - char2code("나")));

    let disassembled = getConstantVowel(char);
    let cho = disassembled[0];

    let jong = disassembled[2];
    if (cho && jong && Hangul.isCho(cho) && Hangul.isJong(jong)) {
      disassembled[0] = jong;
      disassembled[2] = cho;
      result.push(Hangul.assemble(disassembled));
    }
    return result;
  },
  function (char: string) {
    let result = [];
    let disassembled = getConstantVowel(char);
    let cho = disassembled[0];
    let jung = disassembled[1];
    let jong = disassembled[2];

    let choChan;
    let jongChan;
    if (!jung) {
      return [char];
    }
    if (cho && (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ")) {
      choChan = ["ㄹ", "ㄴ", "ㅇ"];
    } else {
      choChan = [cho];
    }

    if (jong && (jong === "ㄹ" || jong === "ㄴ" || jong === "ㅇ")) {
      jongChan = ["ㄹ", "ㄴ", "ㅇ"];
    } else {
      jongChan = [jong];
    }

    for (let chan1 of choChan) {
      for (let chan2 of jongChan) {
        result.push(Hangul.assemble([chan1, jung, chan2].filter((e) => e)));
      }
    }

    return result;
  },
  function (char: string) {
    let code = char2code(char);
    if (
      (code >= char2code("랴") && code <= char2code("럏")) ||
      (code >= char2code("려") && code <= char2code("렿")) ||
      (code >= char2code("료") && code <= char2code("룧")) ||
      (code >= char2code("류") && code <= char2code("륳")) ||
      (code >= char2code("리") && code <= char2code("맇")) ||
      (code >= char2code("례") && code <= char2code("롛"))
    )
      return [code2char(code + char2code("아") - char2code("라"))];
    else if (
      (code >= char2code("라") && code <= char2code("랗")) ||
      (code >= char2code("래") && code <= char2code("랳")) ||
      (code >= char2code("로") && code <= char2code("롷")) ||
      (code >= char2code("루") && code <= char2code("뤃")) ||
      (code >= char2code("르") && code <= char2code("릏")) ||
      (code >= char2code("뢰") && code <= char2code("룋"))
    )
      return [code2char(code + char2code("나") - char2code("라"))];
    else if (
      (code >= char2code("녀") && code <= char2code("녛")) ||
      (code >= char2code("뇨") && code <= char2code("눃")) ||
      (code >= char2code("뉴") && code <= char2code("늏")) ||
      (code >= char2code("니") && code <= char2code("닣"))
    )
      return [code2char(code + char2code("아") - char2code("나"))];
    return [char];
  },
];

export const reverseChangeableMap: ((char: string) => string[])[] = [
  function (char: string) {
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (
      (code >= char2code("야") && code <= char2code("얗")) ||
      (code >= char2code("예") && code <= char2code("옣"))
    )
      return [char, code2char(code + char2code("라") - char2code("아"))];
    else if (
      (code >= char2code("나") && code <= char2code("낳")) ||
      (code >= char2code("내") && code <= char2code("냏")) ||
      (code >= char2code("노") && code <= char2code("놓")) ||
      (code >= char2code("누") && code <= char2code("눟")) ||
      (code >= char2code("느") && code <= char2code("늫")) ||
      (code >= char2code("뇌") && code <= char2code("뇧"))
    )
      return [char, code2char(code + char2code("라") - char2code("나"))];
    else if (
      (code >= char2code("여") && code <= char2code("옇")) ||
      (code >= char2code("요") && code <= char2code("욯")) ||
      (code >= char2code("유") && code <= char2code("윻")) ||
      (code >= char2code("이") && code <= char2code("잏"))
    )
      return [
        char,
        code2char(code + char2code("나") - char2code("아")),
        code2char(code + char2code("라") - char2code("아")),
      ];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (code >= char2code("아") && code <= char2code("잏"))
      return [
        char,
        code2char(code + char2code("나") - char2code("아")),
        code2char(code + char2code("라") - char2code("아")),
      ];
    else if (code >= char2code("나") && code <= char2code("닣"))
      return [char, code2char(code + char2code("라") - char2code("나"))];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    if (code >= char2code("라") && code <= char2code("맇"))
      return [
        char,
        code2char(code + char2code("나") - char2code("라")),
        code2char(code + char2code("아") - char2code("라")),
      ];
    else if (code >= char2code("나") && code <= char2code("닣"))
      return [
        char,
        code2char(code + char2code("라") - char2code("나")),
        code2char(code + char2code("아") - char2code("나")),
      ];
    else if (code >= char2code("아") && code <= char2code("잏"))
      return [
        char,
        code2char(code + char2code("라") - char2code("아")),
        code2char(code + char2code("나") - char2code("아")),
      ];
    return [char];
  },
  function (char: string) {
    let code = char2code(char);
    let result = [char];
    if (
      (code >= char2code("야") && code <= char2code("얗")) ||
      (code >= char2code("예") && code <= char2code("옣"))
    )
      result.push(code2char(code + char2code("라") - char2code("아")));
    else if (
      (code >= char2code("나") && code <= char2code("낳")) ||
      (code >= char2code("내") && code <= char2code("냏")) ||
      (code >= char2code("노") && code <= char2code("놓")) ||
      (code >= char2code("누") && code <= char2code("눟")) ||
      (code >= char2code("느") && code <= char2code("늫")) ||
      (code >= char2code("뇌") && code <= char2code("뇧"))
    )
      result.push(code2char(code + char2code("라") - char2code("나")));
    else if (
      (code >= char2code("여") && code <= char2code("옇")) ||
      (code >= char2code("요") && code <= char2code("욯")) ||
      (code >= char2code("유") && code <= char2code("윻")) ||
      (code >= char2code("이") && code <= char2code("잏"))
    )
      result.push(
        code2char(code + char2code("나") - char2code("아")),
        code2char(code + char2code("라") - char2code("아"))
      );

    let disassembled = getConstantVowel(char);
    let jung = disassembled[1];

    if (jung && jung in banjeonMap) {
      disassembled[1] = banjeonMap[jung];
      result.push(Hangul.assemble(disassembled));
    }
    return result;
  },
  function (char: string) {
    let code = char2code(char);
    let result = [char];
    if (
      (code >= char2code("야") && code <= char2code("얗")) ||
      (code >= char2code("예") && code <= char2code("옣"))
    )
      result.push(code2char(code + char2code("라") - char2code("아")));
    else if (
      (code >= char2code("나") && code <= char2code("낳")) ||
      (code >= char2code("내") && code <= char2code("냏")) ||
      (code >= char2code("노") && code <= char2code("놓")) ||
      (code >= char2code("누") && code <= char2code("눟")) ||
      (code >= char2code("느") && code <= char2code("늫")) ||
      (code >= char2code("뇌") && code <= char2code("뇧"))
    )
      result.push(code2char(code + char2code("라") - char2code("나")));
    else if (
      (code >= char2code("여") && code <= char2code("옇")) ||
      (code >= char2code("요") && code <= char2code("욯")) ||
      (code >= char2code("유") && code <= char2code("윻")) ||
      (code >= char2code("이") && code <= char2code("잏"))
    )
      result.push(
        code2char(code + char2code("나") - char2code("아")),
        code2char(code + char2code("라") - char2code("아"))
      );

    let disassembled = getConstantVowel(char);
    let cho = disassembled[0];
    let jong = disassembled[2];
    if (
      cho &&
      jong &&
      cho !== jong &&
      Hangul.isCho(cho) &&
      Hangul.isJong(jong)
    ) {
      disassembled[0] = jong;
      disassembled[2] = cho;
      result.push(Hangul.assemble(disassembled));
    }
    return result;
  },
  changeableMap[6],
  function (char: string) {
    let code = char2code(char);
    if (
      (code >= char2code("야") && code <= char2code("얗")) ||
      (code >= char2code("예") && code <= char2code("옣"))
    )
      return [char, code2char(code + char2code("라") - char2code("아"))];
    else if (
      (code >= char2code("나") && code <= char2code("낳")) ||
      (code >= char2code("내") && code <= char2code("냏")) ||
      (code >= char2code("노") && code <= char2code("놓")) ||
      (code >= char2code("누") && code <= char2code("눟")) ||
      (code >= char2code("느") && code <= char2code("늫")) ||
      (code >= char2code("뇌") && code <= char2code("뇧"))
    )
      return [char, code2char(code + char2code("라") - char2code("나"))];
    else if (
      (code >= char2code("여") && code <= char2code("옇")) ||
      (code >= char2code("요") && code <= char2code("욯")) ||
      (code >= char2code("유") && code <= char2code("윻")) ||
      (code >= char2code("이") && code <= char2code("잏"))
    )
      return [
        char,
        code2char(code + char2code("나") - char2code("아")),
        code2char(code + char2code("라") - char2code("아")),
      ];
    else if (
      (code >= char2code("랴") && code <= char2code("럏")) ||
      (code >= char2code("려") && code <= char2code("렿")) ||
      (code >= char2code("료") && code <= char2code("룧")) ||
      (code >= char2code("류") && code <= char2code("륳")) ||
      (code >= char2code("리") && code <= char2code("맇")) ||
      (code >= char2code("례") && code <= char2code("롛"))
    )
      return [];
    else if (
      (code >= char2code("라") && code <= char2code("랗")) ||
      (code >= char2code("래") && code <= char2code("랳")) ||
      (code >= char2code("로") && code <= char2code("롷")) ||
      (code >= char2code("루") && code <= char2code("뤃")) ||
      (code >= char2code("르") && code <= char2code("릏")) ||
      (code >= char2code("뢰") && code <= char2code("룋"))
    )
      return [];
    else if (
      (code >= char2code("녀") && code <= char2code("녛")) ||
      (code >= char2code("뇨") && code <= char2code("눃")) ||
      (code >= char2code("뉴") && code <= char2code("늏")) ||
      (code >= char2code("니") && code <= char2code("닣"))
    )
      return [];
    return [char];
  },
];
