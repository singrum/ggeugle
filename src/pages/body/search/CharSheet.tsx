import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { CharMenu, Content } from "./SideBar";
import { useSheet } from "@/lib/store/useSheet";
import { RefHandles } from "react-spring-bottom-sheet/dist/types";

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
          maxHeight - maxHeight / 10,
          maxHeight * 0.5,
          57,
        ]}
        // expandOnContentDrag={false}
        header={
          <div
            onClick={() => {
              console.log(sheetRef);
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
