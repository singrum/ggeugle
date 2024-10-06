import { useSheet } from "@/lib/store/useSheet";
import { BottomSheet } from "react-spring-bottom-sheet";
import { CharMenu, Content } from "./SideBar";

export default function CharSheet() {
  const [sheetRef, open, setOpen] = useSheet((e) => [
    e.sheetRef,
    e.open,
    e.setOpen,
  ]);

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        blocking={false}
        open={open}
        onDismiss={() => setOpen(false)}
        skipInitialTransition
        defaultSnap={57}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 17.5,
          maxHeight * 0.45,
        ]}
        header={
          
            <div>
              <CharMenu />
            </div>
          
        }
      >
        <Content />
      </BottomSheet>
    </>
  );
}
