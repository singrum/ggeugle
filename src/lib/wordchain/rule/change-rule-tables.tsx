import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ChangeRuleTableMap = [
  <></>,
  <div>
    <div>받침에 관계없이 다음과 같이 변환됩니다.</div>
    <div className="flex justify-center pt-4">
      <Table className="w-full max-w-[300px]">
        <TableHeader>
          <TableRow>
            <TableHead className="">음절</TableHead>
            <TableHead className="text-right">변환 가능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              랴, 려, 료, 류, 리, 례
            </TableCell>

            <TableCell className="text-right">야, 여, 요, 유, 이, 예</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              라, 래, 로, 루, 르, 뢰
            </TableCell>

            <TableCell className="text-right">나, 내, 노, 누, 느, 뇌</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">녀, 뇨, 뉴, 니</TableCell>

            <TableCell className="text-right">여, 요, 유, 이</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>,
  <div>
    <span className="font-medium">표준두음법칙</span>에 따라 바꿀 수 있는 경우,
    반드시 해당 규칙을 적용해야 합니다.
  </div>,
  <div>
    <div>받침에 관계없이 다음과 같이 변환됩니다.</div>
    <div className="flex justify-center pt-4">
      <Table className="w-full max-w-[300px] rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="">음절</TableHead>
            <TableHead className="text-right">변환 가능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              야, 여, 요, 유, 이, 예
            </TableCell>

            <TableCell className="text-right">랴, 려, 료, 류, 리, 례</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              나, 내, 노, 누, 느, 뇌
            </TableCell>

            <TableCell className="text-right">라, 래, 로, 루, 르, 뢰</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">여, 요, 유, 이</TableCell>

            <TableCell className="text-right">녀, 뇨, 뉴, 니</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>,
  <div>
    <span className="font-medium">역표준두음법칙</span>에 따라 바꿀 수 있는
    경우, 반드시 해당 규칙을 적용해야 합니다.
  </div>,
  <div>
    <div>중성과 종성에 관계없이 다음과 같이 변환됩니다.</div>
    <div className="flex justify-center pt-4">
      <Table className="w-full max-w-[300px] rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="">초성</TableHead>
            <TableHead className="text-right">변환 가능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">ㄹ</TableCell>

            <TableCell className="text-right">ㄴ, ㅇ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㄴ</TableCell>

            <TableCell className="text-right">ㅇ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>,
  <div>
    <div>중성과 종성에 관계없이 다음과 같이 변환됩니다.</div>
    <div className="flex justify-center pt-4">
      <Table className="w-full max-w-[300px] rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="">초성</TableHead>
            <TableHead className="text-right">변환 가능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">ㄹ</TableCell>

            <TableCell className="text-right">ㄴ, ㅇ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㄴ</TableCell>

            <TableCell className="text-right">ㄹ, ㅇ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅇ</TableCell>

            <TableCell className="text-right">ㄹ, ㄴ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>,
  <div>
    <div>초성과 종성에 관계없이 다음과 같이 변환됩니다.</div>
    <div className="flex justify-center pt-4">
      <Table className="w-full max-w-[300px] rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="">중성</TableHead>
            <TableHead className="text-right">변환 가능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">ㅏ</TableCell>

            <TableCell className="text-right">ㅓ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅑ</TableCell>

            <TableCell className="text-right">ㅕ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅓ</TableCell>

            <TableCell className="text-right">ㅏ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅕ</TableCell>

            <TableCell className="text-right">ㅑ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅗ</TableCell>

            <TableCell className="text-right">ㅜ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅛ</TableCell>

            <TableCell className="text-right">ㅠ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅜ</TableCell>

            <TableCell className="text-right">ㅗ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ㅠ</TableCell>

            <TableCell className="text-right">ㅛ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>,
  <div>
    <p className="">초성과 종성의 위치를 서로 바꿀 수 있습니다.</p>
    <p className="text-muted-foreground">예시) 글 ↔ 륵</p>
  </div>,
  <div>
    <p className="">초성과 종성에 자유두음법칙을 적용할 수 있습니다.</p>
    <p className="text-muted-foreground">예시) 능 → 릉, 능, 늘, 는</p>
  </div>,
];
