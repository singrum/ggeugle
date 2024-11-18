import { create } from "zustand";

export const charMenuList = [
  {
    name: "승리",
    index: 0,
    color: "win",
    desc: (
      <div className="flex flex-col gap-1">
        <div>
          주어졌을 때 반드시 <span className="font-semibold">승리</span>하는
          글자.
        </div>
        <div>
          승리하는 데까지 걸리는 턴 수에 따라{" "}
          <span className="font-semibold">n 턴 후 승리</span>로 표기함
        </div>
      </div>
    ),
  },
  {
    name: "패배",
    index: 1,
    color: "los",
    desc: (
      <div className="flex flex-col gap-1">
        <div>
          주어졌을 때 반드시 <span className="font-semibold">패배</span>하는
          글자.
        </div>
        <div>
          패배하는 데까지 걸리는 턴 수에 따라{" "}
          <span className="font-semibold">n 턴 후 패배</span>로 표기함
        </div>
      </div>
    ),
  },
  {
    name: "루트",
    index: 2,
    color: "route",
    desc: (
      <div className="flex flex-col gap-1">
        <div>
          주어졌을 때 승패 여부를 쉽게{" "}
          <span className="font-semibold">알 수 없는</span> 글자
        </div>
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
