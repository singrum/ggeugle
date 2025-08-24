import { content } from "@/constants/knowledge";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
} from "../ui/sidebar";

export default function KnowledgeSidebar() {
  const collapsibleTriggerClassName = cn(
    sidebarMenuButtonVariants({ variant: "default", size: "lg" }),
    "px-4 rounded-full! font-medium transition-none",
  );
  const superNavLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    cn(collapsibleTriggerClassName, {
      "bg-accent": isActive,
    });
  const subNavLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    cn(
      sidebarMenuButtonVariants({ variant: "default", size: "lg" }),
      "px-4 px-8 rounded-full font-medium transition-none",
      {
        "bg-accent": isActive,
      },
    );
  const setOpen = useWcStore((e) => e.setKnowledgeMenuOpen);
  return (
    <>
      <div className="h-4" />
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink
                to={"/knowledge"}
                end
                className={superNavLinkClassName}
                onClick={() => setOpen(false)}
              >
                개요
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {content.map((item) =>
        item.type === "super" ? (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup className="py-0">
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger className={collapsibleTriggerClassName}>
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0">
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <NavLink
                          onClick={() => setOpen(false)}
                          to={"/knowledge/" + item.title + "/" + subItem.title}
                          className={subNavLinkClassName}
                          aria-disabled={subItem.unwritten}
                        >
                          {subItem.title} {subItem.unwritten && "(작성 중)"}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ) : (
          <SidebarGroup className="py-0" key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to={"/knowledge/" + item.title}
                    className={superNavLinkClassName}
                  >
                    {item.title}
                  </NavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ),
      )}
      <div className="h-4" />
    </>
  );
}
