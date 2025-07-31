import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./app/error-page";
import Layout from "./app/layout";
import Search from "./app/search/search";
import { navInfo } from "./constants/sidebar";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Search /> },
      ...navInfo.map(({ component, key }) => ({
        path: key,
        element: component,
      })),
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
