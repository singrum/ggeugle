import Nav from "./nav";

export default function Sidebar() {
  return (
    <div className="top-14 h-[calc(100svh-(--spacing(14)))] w-75 flex sticky px-4 py-6">
      <Nav />
    </div>
  );
}
