import { create } from "zustand";

export const charMenuList = [
  {
    name: "승리",
    index: 0,
    color: "win",
    desc: (
      <div className="flex flex-col gap-1">
        <p>
          공격 단어의 <span className="font-semibold">첫 글자</span>.
        </p>
        <p>
          내 차례에 <span className="font-semibold">승리 음절</span>이 주어지면
          반드시 <span className="font-semibold">승리</span>함.
        </p>
      </div>
    ),
  },
  {
    name: "패배",
    index: 1,
    color: "los",
    desc: (
      <div className="flex flex-col gap-1">
        <p>
          공격 단어의 <span className="font-semibold">끝 글자</span>.
        </p>
        <p>
          내 차례에 <span className="font-semibold">패배 음절</span>이 주어지면
          반드시 <span className="font-semibold">패배</span>함.
        </p>
      </div>
    ),
  },
  {
    name: "루트",
    index: 2,
    color: "route",
    desc: (
      <div className="flex flex-col gap-1">
        <p>
          내 차례에 <span className="font-semibold">루트 음절</span>이
          주어지면 승패 여부를 쉽게 알 수 없음.
        </p>
      </div>
    ),
  },
];

export interface CharMenuInfo {
  charMenu: number;

  setCharMenu: (charMenu: number) => void;
}

export const useCharMenu = create<CharMenuInfo>((set) => ({
  charMenu: 0,

  setCharMenu: (charMenu: number) => set({ charMenu }),
}));
