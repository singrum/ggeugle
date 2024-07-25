export default function Logo() {
  return (
    <div
      className="font-semibold text-lg ml-1 md:ml-0 md:mb-2 cursor-pointer hover:underline"
      onClick={() => {
        location.reload();
      }}
    >
      끄글
    </div>
  );
}
