
export interface AnalysisInfo {
    charMenu: number;
    charSort: number;
    setCharMenu: (charMenu: number) => void;
  }
  
  export const useCharMenu = create<CharMenuInfo>((set) => ({
    charMenu: 0,
    charSort: 0,
    setCharMenu: (charMenu: number) => set({ charMenu }),
  }));
  