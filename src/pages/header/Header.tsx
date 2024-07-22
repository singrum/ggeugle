import Logo from "./Logo";

export default function Header() {
  return (
    <>
      <div className="flex justify-between items-center p-2 border-b border-border top-0 bg-background z-10 h-12">
        <Logo />
      </div>
    </>
  );
}
