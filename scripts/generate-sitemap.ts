// scripts/generate-sitemap.ts
import fs from "node:fs";
import path from "node:path";

const ruleIds = [
  "구엜룰",
  "신엜룰",
  "넶룰",
  "앞말잇기",
  "노룰",
  "반전룰",
  "챈룰",
  "듭2룰",
  "천도룰",
  "연결룰",
  "듭룰",
  "채린쿵따룰",
  "표샘룰",
  "두샘룰",
  "옛두샘룰",
  "끄투코리아-끝말잇기-노인정-노매너",
  "끄투코리아-끝말잇기-노인정-매너",
  "끄투코리아-끝말잇기-노인정-젠틀",
  "끄투코리아-끝말잇기-어인정-노매너",
  "끄투코리아-끝말잇기-어인정-매너",
  "끄투코리아-끝말잇기-어인정-젠틀",
  "끄투코리아-쿵쿵따-노인정-노매너",
  "끄투코리아-쿵쿵따-노인정-매너",
  "끄투코리아-쿵쿵따-노인정-젠틀",
  "끄투코리아-쿵쿵따-어인정-노매너",
  "끄투코리아-쿵쿵따-어인정-매너",
  "끄투코리아-쿵쿵따-어인정-젠틀",
  "끄투코리아-앞말잇기-노인정-노매너",
  "끄투코리아-앞말잇기-노인정-매너",
  "끄투코리아-앞말잇기-노인정-젠틀",
  "끄투코리아-앞말잇기-어인정-노매너",
  "끄투코리아-앞말잇기-어인정-매너",
  "끄투코리아-앞말잇기-어인정-젠틀",
] as const;

const knowledgePaths = [
  "개요",
  "표준 끝말잇기/유향 그래프 모델",
  "표준 끝말잇기/승패 전파와 가지치기",
  "표준 끝말잇기/루프를 활용한 추가 승패 판별",
  "표준 끝말잇기/돌림 단어 쌍 제거",
  "두음 법칙 끝말잇기/이분 유향 그래프 모델",
  "두음 법칙 끝말잇기/승패 전파와 가지치기",
  "두음 법칙 끝말잇기/돌림 단어 쌍 제거",
  "강한 연결 요소",
  "끝말잇기의 난해성",
  "자주 묻는 질문",
] as const;
// 1. 설정
const BASE_URL = "https://engine.ikki.app";
const STATIC_ROUTES = [
  "/home/sample",
  "/home/storage",
  ...ruleIds
    .map((id: string) => [`/engine/${id}/search`, `/engine/${id}/game`])
    .flat(),
  ...knowledgePaths.map((path) => `/knowledge/${path}`),
].map((route) => encodeURI(route));

async function run() {
  const allRoutes = STATIC_ROUTES;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === "/" ? "1.0" : "0.7"}</priority>
    </url>`,
    )
    .join("")}
</urlset>`.trim();

  // React Router v7의 빌드 결과물 위치 (기본값: build/client)
  // 정적 파일로 서빙되려면 build/client 폴더에 직접 넣는 것이 좋습니다.
  const distPath = path.resolve(process.cwd(), "build/client/sitemap.xml");

  // 폴더가 없는 경우를 대비해 생성
  const dir = path.dirname(distPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(distPath, sitemap);
  console.log(`✅ [TS] Sitemap generated at: ${distPath}`);
}

run().catch((error) => {
  console.error("❌ [TS] Error generating sitemap:", error);
  process.exit(1);
});
