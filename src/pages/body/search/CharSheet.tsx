import { useSheet } from "@/lib/store/useSheet";
import { BottomSheet } from "react-spring-bottom-sheet";
import { CharMenu, Content } from "./SideBar";

export default function CharSheet() {
  const [sheetRef] = useSheet((e) => [e.sheetRef]);

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        blocking={false}
        open
        skipInitialTransition
        defaultSnap={57}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 15,
          maxHeight * 0.4,
          62,
        ]}
        header={
          <div
            onClick={() => {
              if (sheetRef.current.height < 70) {
                sheetRef.current.snapTo(
                  ({ snapPoints }: { snapPoints: number[] }) => snapPoints[1],
                  {}
                );
              }
            }}
          >
            <div>
              <CharMenu />
            </div>
          </div>
        }
      >
        <Content />
      </BottomSheet>
    </>
  );
}
