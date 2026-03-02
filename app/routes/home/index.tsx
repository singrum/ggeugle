import { redirect } from "react-router";

export async function clientLoader() {
  const hasStorage = localStorage.getItem("last_home_path") !== null;
  return redirect(
    hasStorage ? localStorage.getItem("last_home_path")! : "/home/sample",
  );
}
clientLoader.hydrate = true;
export default function HomeIndex() {
  return null;
}
