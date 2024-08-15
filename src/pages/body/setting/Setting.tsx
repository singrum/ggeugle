import { cn } from "@/lib/utils";
import React, { useState } from "react";
import PreferenceSetting from "./PreferenceSetting";
import { RuleSetting } from "./RuleSetting";
import Header from "@/pages/header/Header";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const menuList = [{ name: "룰 설정" }, { name: "환경 설정" }];

export default function Setting() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="md:min-h-0 md:overflow-auto md:h-full w-full md:flex md:justify-center">
      {!isDesktop && <Header />}
      <div className="p-4 md:p-5 w-full md:max-w-screen-md flex flex-col gap-5">
        <Tabs defaultValue="rule" className="">
          <TabsList className="md:m-5 md:mb-0 mb-2 mx-auto">
            <TabsTrigger value="rule">룰 설정</TabsTrigger>
            <TabsTrigger value="preference">환경 설정</TabsTrigger>
          </TabsList>
          <TabsContent value="rule">
            <div className="md:p-5">
              <RuleSetting />
            </div>
          </TabsContent>
          <TabsContent value="preference">
            <div className="md:p-5">
              <PreferenceSetting />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
