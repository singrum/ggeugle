import WinloseIndicator from "./winlose-indicator";
import WordButton from "./word-button";
import WordList from "./word-list";

export default function WinningMoves({ data }: { data: string[] }) {
  return (
    <WordList>
      <WinloseIndicator isWin={true} />
      {data.map((word) => (
        <WordButton key={word} active={true}>
          {word}
        </WordButton>
      ))}
    </WordList>
  );
}
