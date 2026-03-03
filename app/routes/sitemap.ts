// app/routes/sitemap.xml.ts
import type { LoaderFunctionArgs } from "react-router";
import { sampleRules } from "~/constants/sample-rules";

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = "https://engine.ikki.app";
  // 2. XML 내용 구성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/home/sample</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      
      <url>
        <loc>${baseUrl}/home/storage</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
        ${sampleRules.map(
          (rule) =>
            `<url>
                <loc>${baseUrl}/engine/${rule.id}/search</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <priority>1.0</priority>
            </url>`,
        )}
      
      </urlset>`;

  // 3. XML 헤더와 함께 반환
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
