import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

// const router = createBrowserRouter([
//   { path: "/ggeugle", element: <App /> },
//   { path: "/ggeugle/docs", element: <Docs /> },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <div className="noto-sans-kr h-full min-h-0">
      {/* <RouterProvider router={router} /> */}

      <App />
    </div>
  </ThemeProvider>
);
