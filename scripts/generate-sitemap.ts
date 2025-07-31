// scripts/generate-sitemap.ts
import fs from "fs";
import path from "path";
import { routes } from "../src/routes";

const hostname = "https://engine.ikki.app";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${hostname}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`,
  )
  .join("")}
</urlset>
`;

fs.writeFileSync(path.resolve("public", "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml generated at public/sitemap.xml");
