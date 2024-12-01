import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export function StdTable() {
  return (
    <Table>
      <TableCaption>표준두음법칙 변환표</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">음절</TableHead>
          <TableHead className="text-right">변환 가능</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">랴, 려, 료, 류, 리, 례</TableCell>

          <TableCell className="text-right">야, 여, 요, 유, 이, 예</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">라, 래, 로, 루, 르, 뢰</TableCell>

          <TableCell className="text-right">나, 내, 노, 누, 느, 뇌</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">녀, 뇨, 뉴, 니</TableCell>

          <TableCell className="text-right">여, 요, 유, 이</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function StdRevTable() {
  return (
    <Table>
      <TableCaption>역표준두음법칙 변환표</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">음절</TableHead>
          <TableHead className="text-right">변환 가능</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">야, 여, 요, 유, 이, 예</TableCell>

          <TableCell className="text-right">랴, 려, 료, 류, 리, 례</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">나, 내, 노, 누, 느, 뇌</TableCell>

          <TableCell className="text-right">라, 래, 로, 루, 르, 뢰</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">여, 요, 유, 이</TableCell>

          <TableCell className="text-right">녀, 뇨, 뉴, 니</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

