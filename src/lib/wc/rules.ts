import { RuleForm } from "../store/useWC";

export const sampleRules: { name: string; ruleForm: RuleForm }[] = [
  {
    name: "구엜룰",
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
  {
    name: "쿵쿵따",
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
      regexFilter: "(.{3})",
      addedWords1: "",
      addedWords2: "",
      removeHeadTailDuplication: false,
    },
  },
  {
    name: "표샘룰",
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