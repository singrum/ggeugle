export type SuperMenu = { title: string } & { type: "super"; items: SubMenu[] };
export type SubMenu = { title: string } & { type: "sub"; unwritten?: boolean };

export type Content = (SuperMenu | SubMenu)[];

export const content: Content = [
  {
    type: "super",
    title: "표준 끝말잇기",
    items: [
      {
        type: "sub",
        title: "유향 그래프 모델",
      },
      {
        type: "sub",
        title: "승패 전파와 가지치기",
      },
      {
        type: "sub",
        title: "루프를 활용한 추가 승패 판별",
      },
      {
        type: "sub",
        title: "돌림 단어 쌍 제거",
      },
      {
        type: "sub",
        title: "강한 연결 요소",
      },
    ],
  },
  {
    type: "super",
    title: "두음 법칙 끝말잇기",
    items: [
      {
        type: "sub",
        title: "이분 유향 그래프 모델",
      },
      {
        type: "sub",
        title: "승패 전파와 가지치기",
        unwritten: true,
      },
      {
        type: "sub",
        title: "돌림 단어 쌍 제거",
        unwritten: true,
      },
    ],
  },
];

export function getAllContentPath() {
  const paths = [];
  for (const item of content) {
    if (item.type === "sub") {
      if (!item.unwritten) {
        paths.push(encodeURI(item.title));
      }
    } else {
      for (const subMenu of item.items) {
        if (!subMenu.unwritten) {
          paths.push(`${encodeURI(item.title)}/${encodeURI(subMenu.title)}`);
        }
      }
    }
  }
  return paths;
}
