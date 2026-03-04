import {
  isRouteErrorResponse,
  Links,
  Meta,
  Navigate,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  type MetaFunction,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "./components/theme-provider";
import { metaDescription, metaImage, metaTitle } from "./lib/utils";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "icon", href: "/logo.png", type: "image/x-icon" },
  { rel: "icon", href: "/logo.png", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/logo.png" },
];

export const meta: MetaFunction = () => {
  return [
    {
      name: "naver-site-verification",
      content: "eaba2366fdaca84d9cc4c1d7ba78ac752d2c0416",
    },

    {
      property: "twitter:card",
      content: "summary_large_image",
    },

    {
      property: "og:site_name",
      content: "끝말잇기 엔진",
    },
    ...metaTitle("끝말잇기 엔진"),
    ...metaDescription(
      "끝말잇기 엔진은 끝말잇기 단어 검색과 끝말잇기 게임 분석을 위한 웹 서비스입니다. (구 끄글)",
    ),
    ...metaImage("/static-opengraph.png"),
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Links />
        <Meta />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7KVJT9KM4X"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-7KVJT9KM4X");
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isLoading && (
            <div className="fixed top-0 left-0 z-50 h-1 w-full bg-primary animate-pulse" />
          )}
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Navigate to="/home" replace />;
  }
  let message = "에러 발생";
  let details = "개발자에게 문의해주세요";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto h-svh">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
