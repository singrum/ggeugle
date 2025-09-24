import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/providers/theme-provider";

export function ModeToggleSelect() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Select
      onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
      value={resolvedTheme}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="light">라이트</SelectItem>
        <SelectItem value="dark">다크</SelectItem>
        <SelectItem value="system">시스템</SelectItem>
      </SelectContent>
    </Select>
  );
}
