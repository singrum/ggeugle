import { MoreVertical } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  HelpToolbarContent,
  InfoToolbarContent,
  SettingsToolbarContent,
} from "~/routes/engine/$rule/+components/site-header/toolbar";

export default function MoreTrigger() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg">
          <MoreVertical className="stroke-foreground size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {[
          { content: <SettingsToolbarContent /> },
          { content: <HelpToolbarContent /> },
          { content: <InfoToolbarContent /> },
        ].map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <DropdownMenuSeparator />}
            {item.content}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
