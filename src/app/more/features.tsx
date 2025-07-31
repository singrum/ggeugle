const features = [
  "승패에 따른 음절 및 단어 분류",
  "최적의 수와 필승 전략 탐색 알고리즘 적용",
  "컴퓨터와의 실시간 대결 인터페이스",
  "게임 규칙 맞춤 설정 지원",
];

export default function Features() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">주요 기능</h3>
      <ul
        // style={{ listStyle: "disc", paddingLeft: "1rem" }}
        className="text-muted-foreground mt-2 space-y-2 text-xs"
      >
        {features.map((e, i) => (
          <li key={i}>
            <span className="text-foreground mr-1 align-top text-[0.5rem]">
              {i + 1}
            </span>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
