import { toObject } from "@/lib/utils";
import type { RuleForm } from "@/types/rule";
import { cates, poses } from "./rule";

export const sampleRules: RuleForm[] = [
  {
    metadata: {
      title: "구엜룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "신엜룰",
      description:
        "(신)표준국어대사전에 등록된 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 1,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 0, 0, 0]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "넶룰",
      description:
        "네이버 국어사전에 등록된 명사만 사용할 수 있으며, 자유 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 3,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 5,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "앞말잇기",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 두음 법칙은 적용되지 않습니다. 끝말잇기와는 달리, 앞 단어의 첫 글자로 끝나는 단어를 말해야 합니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 1,
      rawHeadIdx: 1,
      tailDir: 0,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "노룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 두음 법칙과 한방 단어는 사용할 수 없습니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 0,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 2 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "반전룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 모음 반전 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 7,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "챈룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 자음 상하 반전 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 8,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "듭2룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 초성과 종성에 자유 두음 법칙이 적용됩니다.",
    },
    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 9,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "천도룰",
      description:
        "(신)표준국어대사전에 등록된 세 글자 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다. 한방 단어는 사용할 수 없습니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 1,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 1, 0]),
          cate: toObject(cates, [1, 0, 0, 0]),
        },
      },
      regexFilter: "(.{3})",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 2 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "연결룰",
      description: "구엜룰에서 '붕어톱', '궤휼', '잎뽕'이 제외됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "붕어톱 궤휼 잎뽕",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "듭룰",
      description:
        "(구)표준국어대사전에 등록된 명사만 사용할 수 있으며, 양방향 자유 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 6,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "채린쿵따룰",
      description:
        "(구)표준국어대사전에 등록된 세 글자 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다. 한방 단어는 사용할 수 없습니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 0,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 1, 1, 1]),
        },
      },
      regexFilter: "(.{3})",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 1 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "표샘룰",
      description:
        "우리말샘에 등록된 일반어 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 2,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 0, 0, 0]),
        },
      },
      regexFilter: ".*",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "두샘룰",
      description:
        "우리말샘에 등록된 두 글자의 일반어 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 2,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 0, 0, 0]),
        },
      },
      regexFilter: "(.{2})",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
  {
    metadata: {
      title: "옛두샘룰",
      description:
        "우리말샘에 등록된 두 글자의 일반어 명사 또는 옛말 명사만 사용할 수 있으며, 표준 두음 법칙이 적용됩니다.",
    },

    wordRule: {
      words: {
        type: "selected",
        option: {
          dict: 2,
          pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 0, 0]),
          cate: toObject(cates, [1, 0, 0, 1]),
        },
      },
      regexFilter: "(.{2})",
      removedWords: "",
      addedWords: "",
    },
    wordConnectionRule: {
      changeFuncIdx: 1,
      headDir: 0,
      rawHeadIdx: 1,
      tailDir: 1,
      rawTailIdx: 1,
    },
    postprocessing: {
      removedWords: "",
      manner: { type: 0 },
      addedWords: "",
    },
  },
];
