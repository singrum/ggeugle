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
          끝말잇기 룰 중 현재까지 가장 인기가 많고 연구가 많이 이뤄진 룰입니다.
          <span className="font-medium">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-medium">명사</span> 사용 가능하며,{" "}
          <span>표준 두음 법칙</span>이 적용됩니다.
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
          <span className="font-medium">(신)표준국어대사전</span>에 등록된{" "}
          <span className="font-medium">명사</span> 사용 가능하며,{" "}
          <span>표준 두음 법칙</span>이 적용됩니다.
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
          구엜룰 다음으로 인기가 많은 룰입니다.
          <span className="font-medium">네이버 국어사전</span>에 등록된{" "}
          <span className="font-medium">명사</span> 사용 가능하며,{" "}
          <span>자유 두음 법칙</span>이 적용됩니다.
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
          <span className="font-medium">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-medium">명사</span> 사용 가능하며, 두음 법칙은
          적용하지 않습니다.
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
          <span className="font-medium">(구)표준국어대사전</span>에 등록된{" "}
          <span className="font-medium">명사</span>만 사용 가능하며, 두음 법칙은
          적용하지 않습니다.
        </p>
        <p>한방 단어는 불가능합니다.</p>
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
          <span className="font-medium">우리말샘</span>에 등록된{" "}
          <span className="font-medium">일반어 명사</span>만 사용 가능하며, 표준
          두음 법칙이 적용됩니다.
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
          <span className="font-medium">우리말샘</span>에 등록된{" "}
          <span className="font-medium">두 글자인 일반어 명사</span>만 사용
          가능하며, 표준 두음 법칙이 적용됩니다.
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
          <span className="font-medium">우리말샘</span>에 등록된{" "}
          <span className="font-medium">두 글자인 일반어 명사</span> 또는{" "}
          <span className="font-medium">두 글자인 옛말 명사</span>만 사용
          가능하며, 표준 두음 법칙이 적용됩니다.
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
