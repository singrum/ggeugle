import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./app/error-page";
import Layout from "./app/layout";
import Search from "./app/search/search";

import KnowledgeLayout from "./app/knowledge/knowledge-layout";
import KnowledgeOverview from "./app/knowledge/knowledge-overview";
import KnowledgePage from "./app/knowledge/knowledge-page";
import { content } from "./constants/knowledge";
import { navInfo } from "./constants/sidebar";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Search /> },
      ...[0, 1, 2, 4].map((i) => {
        const { component, key } = navInfo[i];
        return {
          path: key,
          element: component,
        };
      }),
      {
        path: "/knowledge",
        element: <KnowledgeLayout />,
        children: [
          { index: true, element: <KnowledgeOverview /> },
          ...content
            .filter(({ type }) => type === "super")
            .map(({ title }) => ({
              path: `/knowledge/${title}/:page`,
              element: <KnowledgePage />,
            })),
          { path: "/knowledge/:page", element: <KnowledgePage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
