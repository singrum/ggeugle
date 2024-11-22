import { ReactNode } from "react";
import { RuleForm } from "../store/useWC";

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
          <span className="font-semibold">명사</span> 사용 가능하며,{" "}
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
];
