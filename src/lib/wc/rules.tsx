import { ReactNode } from "react";
import { RuleForm } from "../store/useWC";

export const dicts: { name: string; desc: ReactNode }[] = [
  {
    name: "(구)표준국어대사전",
    desc: (
      <div>
        <p>
          국립국어원의 개정 전 표준국어대사전입니다. 현재는 존재하지 않는
          사전이지만{" "}
          <a
            target="_blank"
            href="https://github.com/JJoriping/KKuTu/blob/master/db.sql"
            className="underline"
          >
            KKuTu Github
          </a>
          에서 백업된 데이터를 얻을 수 있습니다.
        </p>
        <p>
          (구)표준국어대사전은 <span className="font-medium">구엜룰</span>에서
          사용됩니다.
        </p>
      </div>
    ),
  },

  {
    name: "(신)표준국어대사전",
    desc: (
      <div>
        <p>
          국립국어원의 개정 후 표준국어대사전이며{" "}
          <a
            target="_blank"
            href="https://stdict.korean.go.kr/main/main.do"
            className="underline"
          >
            공식 홈페이지
          </a>
          에서 데이터를 열람할 수 있습니다.
        </p>
        <p>
          개정 전 표준국어대사전과 달리 방언, 북한어, 옛말을 제외한{" "}
          <span className="font-medium">일반어</span>만 수록되어 있습니다.
        </p>
        <p>
          <span className="font-medium">신엜룰, 천도룰</span> 등에서 사용됩니다.
        </p>
      </div>
    ),
  },
  {
    name: "우리말샘",
    desc: (
      <div>
        <p>
          국립국어원의 개방형 국어사전이며{" "}
          <a
            target="_blank"
            href="https://opendict.korean.go.kr/main"
            className="underline"
          >
            공식 홈페이지
          </a>
          에서 데이터를 열람할 수 있습니다.
        </p>
        <p>
          일반어, 방언, 북한어, 옛말이 모두 수록되어있고 지명, 학교 이름, 인명,
          책 이름 등의 수많은 단어들이 수록되어 있어 현존하는 국어사전 중 가장
          규모가 큰 국어사전입니다.
        </p>
        <p>
          <span className="font-medium">표샘룰, 두샘룰, 옛두샘룰</span> 등에서
          사용됩니다.
        </p>
      </div>
    ),
  },
  {
    name: "네이버 국어사전",
    desc: (
      <div>
        <p>
          네이버에서 제공하는 국어사전이며{" "}
          <a
            target="_blank"
            href="https://ko.dict.naver.com/#/main"
            className="underline"
          >
            공식 홈페이지
          </a>
          에서 데이터를 열람할 수 있습니다.
        </p>
        <p>
          <span className="font-medium">
            (구)표준국어대사전, 우리말샘, 고려대한국어대사전
          </span>
          의 일부 단어들이 수록되어 있습니다.
        </p>
        <span className="font-medium">넶룰</span>에서 사용됩니다.
      </div>
    ),
  },
  {
    name: "끄투 노인정",
    desc: (
      <div>
        <p>
          끄투코리아에서 <span className="font-medium">어인정</span> 규칙을 켜지
          않은 상태에서 사용되는 사전이며{" "}
          <span className="font-medium">(구)표준국어대사전</span>에서 아래의
          품사들만 허용합니다.
        </p>
        <p className="text-muted-foreground">
          (품사 없음), 명사, 대명사, 수사, 관형사, 부사, 감탄사, 의존명사,
          관형사·명사, 수사·관형사, 명사·부사, 감탄사·명사, 대명사·부사,
          대명사·감탄사
        </p>
        <p></p>
      </div>
    ),
  },
  {
    name: "끄투 어인정",
    desc: (
      <div>
        <p>
          끄투코리아에서 <span className="font-medium">어인정</span> 규칙을 켠
          상태에서 사용되는 사전이며 노인정 단어에서 특수한 단어들이 추가됩니다.
        </p>
        <p>추가되는 단어들의 그룹은 아래와 같습니다.</p>
        <p className="text-muted-foreground">
          THE iDOLM@STER, 간식, 국가지정문화재, 국내 관광지/축제, 국내 방송
          프로그램, 기업/브랜드, 끄투코리아, 넷플릭스, 대한민국 공공기관,
          대한민국 학교, 도라에몽, 동물의 숲, 동방 프로젝트, 디지몬, 라이트
          노벨, 러브 라이브!, 로스트아크, 리그 오브 레전드, 마인크래프트,
          만화/애니메이션, 메이플스토리, 모두의마블, 모바일 애플리케이션,
          뮤지컬/연극, 발로란트, 보드게임, 브롤스타즈, 블루 아카이브, 비디오
          게임, 성어, 세븐나이츠, 소설/시/희곡, 스타크래프트, 시드 마이어의
          문명, 엘소드, 영화, 오버워치, 원신, 웹툰, 유네스코 유산, 유명인,
          유희왕, 자동차, 젤다의 전설, 직업, 카트라이더, 쿠키런, 클래시
          로얄/클래시 오브 클랜, 포켓몬스터, 하스스톤, 한국 교통시설, 한국
          대중음악, 한국 라디오 프로그램, 한국 행정구역, 한국사 사건사고,
          히어로즈 오브 더 스톰
        </p>
      </div>
    ),
  },
];

export const changeables: { name: string }[] = [
  { name: "없음" },
  {
    name: "표준두음법칙",
  },
  {
    name: "강제표준두음법칙",
  },
  {
    name: "역표준두음법칙",
  },
  {
    name: "강제역표준두음",
  },
  {
    name: "자유두음법칙",
  },
  {
    name: "양방향자유두음법칙",
  },
  {
    name: "모음반전",
  },
  {
    name: "자음반전",
  },
  {
    name: "초성종성자유두음법칙",
  },
];

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

export const sampleRules: {
  name: string;
  desc?: ReactNode;
  ruleForm: RuleForm;
}[] = [
  {
    name: "구엜룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">표준 두음 법칙</span>이 적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },

  {
    name: "신엜룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(신)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">표준 두음 법칙</span>이 적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 1,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "넶룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">네이버 국어사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">자유 두음 법칙</span>이 적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 3,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 5,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },

  {
    name: "앞말잇기",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">두음 법칙은 불가능</span>합니다.
        </p>
        <p>
          끝말잇기와 달리, 이전에 나온 단어의 첫 글자로 끝나는 단어를 말해야
          합니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 0,
      headDir: 1,
      headIdx: 1,
      tailDir: 0,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "노룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">두음 법칙과 한방단어는 불가능</span>
          합니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 0,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 2,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  // {
  //   name: "쿵쿵따",
  //   ruleForm: {
  //     dict: 0,
  //     pos: Object.assign({}, [
  //       true,
  //       false,
  //       false,
  //       false,
  //       false,
  //       false,
  //       false,
  //       false,
  //       false,
  //     ]),
  //     cate: Object.assign({}, [true, true, true, true]),
  //     chan: 1,
  //     headDir: 0,
  //     headIdx: 1,
  //     tailDir: 1,
  //     tailIdx: 1,
  //     manner: 0,
  //     regexFilter: "(.{3})",
  //     addedWords1: "",
  //     addedWords2: "",
  //     removeHeadTailDuplication: false,
  //   },
  // },

  {
    name: "반전룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">모음 반전 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 7,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "챈룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">자음 상하 반전 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 8,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "듭2룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">초성 종성 자유 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 9,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },

  {
    name: "천도룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(신)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">세 글자 명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">표준 두음 법칙</span>이 적용됩니다.{" "}
        </p>
        <p>
          <span className="font-semibold">한방 단어</span>는 사용 불가능합니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 1,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
      ]),
      cate: Object.assign({}, [true, false, false, false]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 2,
      regexFilter: "(.{3})",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "연결룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">구엜룰</span>에서{" "}
          <span className="font-semibold">붕어톱</span>,{" "}
          <span className="font-semibold">궤휼</span>,{" "}
          <span className="font-semibold">잎뽕</span>이 제외됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, false, false, false]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: "(?!(붕어톱|궤휼|잎뽕)$).*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "듭룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">양방향 자유 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 6,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "채린쿵따룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-semibold">3글자 명사</span>만 사용 가능하며{" "}
          <span className="font-semibold">표준 두음 법칙</span>이 적용됩니다.
        </p>{" "}
        <p>
          <span className="font-semibold">한방 단어</span>는 사용 불가능합니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 0,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, true, true, true]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 1,
      regexFilter: "(.{3})",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "표샘룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">우리말샘</span>에 등록된{" "}
          <span className="font-semibold">일반어 명사</span>만 사용 가능하며,{" "}
          <span className="font-semibold">표준 두음 법칙</span>이 적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 2,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, false, false, false]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: ".*",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "두샘룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">우리말샘</span>에 등록된{" "}
          <span className="font-semibold">두 글자인 일반어 명사</span>만 사용
          가능하며, <span className="font-semibold">표준 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 2,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, false, false, false]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: "(.{2})",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "옛두샘룰",
    desc: (
      <div>
        <p>
          <span className="font-semibold">우리말샘</span>에 등록된{" "}
          <span className="font-semibold">두 글자인 일반어 명사</span> 또는{" "}
          <span className="font-semibold">두 글자인 옛말 명사</span>만 사용
          가능하며, <span className="font-semibold">표준 두음 법칙</span>이
          적용됩니다.
        </p>
      </div>
    ),
    ruleForm: {
      dict: 2,
      pos: Object.assign({}, [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]),
      cate: Object.assign({}, [true, false, false, true]),
      chan: 1,
      headDir: 0,
      headIdx: 1,
      tailDir: 1,
      tailIdx: 1,
      manner: 0,
      regexFilter: "(.{2})",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
];
