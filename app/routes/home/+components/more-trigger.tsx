import { MoreVertical } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar";
import {
  HelpToolbarContent,
  InfoToolbarContent,
  SettingsToolbarContent,
} from "~/routes/engine/$rule/+components/site-header/toolbar";

export default function MoreTrigger() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" size="icon-lg">
            <MoreVertical className="stroke-foreground size-5" />
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          {[
            { content: <SettingsToolbarContent /> },
            { content: <HelpToolbarContent /> },
            { content: <InfoToolbarContent /> },
          ].map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <MenubarSeparator />}
              {item.content}
            </Fragment>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
