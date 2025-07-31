const newFeatures = [
  "음절 및 단어 분류 알고리즘 속도 향상",
  "음절 위치 선택(첫 음절 / 끝 음절) 기능 추가",
  "음절 4유형, 단어 6유형으로 세분화된 분류 제공",
  "강한 연결 요소, 음절별 이전/다음 단어 분포 기능",
  "룰 설정 시 다음 단어 개수 제한 옵션 추가",
  "임계 단어 제외 결과를 실시간으로 표시",
  "여러 단어의 필승 전략을 동시에 탐색 가능",
  "전략 탐색 시 다음 단어 우선순위 편집 가능",
  "빠른 룰 설정 시 URL에 상태 저장 및 새로고침 시 유지",
  "단어 검색 시 Regex 사용 가능",
];

export default function NewFeatures() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">새로운 기능</h3>
      <ul className="text-muted-foreground mt-2 space-y-2 text-xs">
        {newFeatures.map((e, i) => (
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
