import { toObject } from "~/lib/utils";
import type { RuleForm } from "~/types/rule";
import { cates, poses } from "./rule";

export const sampleRules: RuleForm[] = [
  {
    id: "구엜룰",
    metadata: {
      title: "구엜룰",
      updatedAt: 0,
      color: "blue",
    },
    content: {
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
  },
  {
    id: "신엜룰",
    metadata: {
      title: "신엜룰",
      updatedAt: 0,
      color: "indigo",
    },
    content: {
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
  },
  {
    id: "넶룰",
    metadata: {
      title: "넶룰",
      updatedAt: 0,
      color: "violet",
    },
    content: {
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
  },
  {
    id: "앞말잇기",
    metadata: {
      title: "앞말잇기",
      updatedAt: 0,
      color: "purple",
    },
    content: {
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
  },
  {
    id: "노룰",
    metadata: {
      title: "노룰",
      updatedAt: 0,
      color: "fuchsia",
    },
    content: {
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
  },
  {
    id: "반전룰",
    metadata: {
      title: "반전룰",
      updatedAt: 0,
      color: "pink",
    },
    content: {
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
  },
  {
    id: "챈룰",
    metadata: {
      title: "챈룰",
      updatedAt: 0,
      color: "rose",
    },
    content: {
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
  },
  {
    id: "듭2룰",
    metadata: {
      title: "듭2룰",
      updatedAt: 0,
      color: "red",
    },
    content: {
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
  },
  {
    id: "천도룰",
    metadata: {
      title: "천도룰",
      updatedAt: 0,
      color: "orange",
    },
    content: {
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
  },
  {
    id: "연결룰",
    metadata: {
      title: "연결룰",
      updatedAt: 0,
      color: "amber",
    },
    content: {
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
  },
  {
    id: "듭룰",
    metadata: {
      title: "듭룰",
      updatedAt: 0,
      color: "yellow",
    },
    content: {
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
  },

  {
    id: "채린쿵따룰",
    metadata: {
      title: "채린쿵따룰",
      updatedAt: 0,
      color: "lime",
    },
    content: {
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
  },
  {
    id: "우샘룰",
    metadata: {
      title: "우샘룰",
      updatedAt: 0,
      color: "green",
    },
    content: {
      wordRule: {
        words: {
          type: "selected",
          option: {
            dict: 2,
            pos: toObject(poses, [1, 0, 0, 0, 0, 0, 0, 1, 0]),
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
  },
  {
    id: "풀우샘룰",
    metadata: {
      title: "풀우샘룰",
      updatedAt: 0,
      color: "green",
    },
    content: {
      wordRule: {
        words: {
          type: "selected",
          option: {
            dict: 10,
            pos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
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
        manner: { type: 1 },
        addedWords: "",
      },
    },
  },
  {
    id: "표샘룰",
    metadata: {
      title: "표샘룰",
      updatedAt: 0,
      color: "emerald",
    },
    content: {
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
  },
  {
    id: "두샘룰",
    metadata: {
      title: "두샘룰",
      updatedAt: 0,
      color: "teal",
    },
    content: {
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
  },
  {
    id: "옛두샘룰",
    metadata: {
      title: "옛두샘룰",
      updatedAt: 0,
      color: "cyan",
    },
    content: {
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
  },

  {
    id: "로블록스 한국 끝말잇기",
    metadata: {
      title: "로블록스 한국 끝말잇기",
      updatedAt: 0,
      color: "sky",
    },
    content: {
      wordRule: {
        words: {
          type: "selected",
          option: {
            dict: 9,
            pos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
            cate: toObject(cates, [1, 1, 1, 1]),
          },
        },
        regexFilter: ".*",
        removedWords: "",
        addedWords: "",
      },
      wordConnectionRule: {
        changeFuncIdx: 10,
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
  },
];
