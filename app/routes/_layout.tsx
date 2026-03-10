import { useEffect } from "react";
import { Outlet } from "react-router";
import { registerSW } from "virtual:pwa-register";

export default function Layout() {
  useEffect(() => {
    registerSW();
  }, []);
  return <Outlet />;
}
