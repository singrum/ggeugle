import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeProvider } from "next-themes";

export default function Donation() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-auto lg:h-dvh">
      <div className="mx-auto my-auto max-w-screen-md space-y-8 p-6">
        <h1 className="text-xl font-bold break-keep md:text-2xl">
          끝말잇기 엔진의 성장을 함께해주세요 ❤️🎉
        </h1>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">개발자의 한 마디</h2>
          <div className="space-y-2 text-base">
            <p>
              끝말잇기 엔진은 2022년 9월부터 저의 열정으로 직접 개발하고 운영해
              온 개인 프로젝트입니다. 광고나 유료 구독 없이, 매일 약 150명의
              사용자분들이 함께 즐겨주시는 덕분에 지금까지 이 서비스를 이어올 수
              있었습니다.
            </p>

            <p>
              혹시 끝말잇기 엔진을 즐겁게 사용하셨다면, 아래 QR 코드를 통해
              따뜻한 마음을 전해주세요. 여러분의 작은 응원이 이 서비스를 계속
              유지하고 발전시키는 데 큰 힘이 됩니다. 진심으로 감사드립니다!
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">후원하기</Button>
          </DialogTrigger>
          <ThemeProvider attribute="class" defaultTheme="light">
            <DialogContent className="flex items-center justify-center border-0 bg-white [&_svg]:stroke-black">
              <div className="flex items-center justify-center">
                <img
                  src="/donation-qr.png"
                  alt="QR Code"
                  className="h-auto max-h-[500px] w-auto rounded-lg"
                />
              </div>
            </DialogContent>
          </ThemeProvider>
        </Dialog>
        <div className="space-y-2 text-base">
          <h2 className="text-lg font-semibold">후원금의 사용처</h2>
          <div>
            여러분의 후원은 끝말잇기 엔진의 발전을 위해 소중하게 사용됩니다.
          </div>
          <div>
            1. <strong>도메인 비용</strong> (연간 $15.20)
          </div>
          <div>
            2. <strong>서버 호스팅 비용</strong> (사용자가 늘면 발생할 수 있는
            잠재적 비용)
          </div>
          <div>
            3. <strong>개발자의 커피값</strong> (새로운 기능을 만드는 연료!)
          </div>
        </div>
      </div>
    </div>
  );
}
