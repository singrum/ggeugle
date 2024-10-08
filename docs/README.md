# 끄글 : 끝말잇기 검색엔진

[바로가기](https://singrum.github.io/ggeugle)

끄글은 끝말잇기 게임 분석을 위한 웹 어플리케이션입니다. 대표적으로 다음과 같은 기능을 제공합니다.

- 각 글자로 시작하는 공격 단어(한방 단어, 유도 단어), 방어 단어, 루트 단어 분류
- 자유로운 단어 삭제 및 추가, 실시간 분류 알고리즘 적용
- 루트전에서의 필승 전략 탐색
- 구엜룰, 신엜룰, 앞말잇기, 쿵쿵따 등 다양한 커스텀 룰 설정
- 글자 및 단어들에 관한 통계치 제공
- ai 인공지능 봇과의 대결

끄글의 글자, 단어 분류 절차는 다음과 같습니다.

1. 1차 승패 분류 : n턴 후 승리 글자, n턴 후 패배 글자를 분류 합니다.
2. 되돌림 쌍 제거 : 승패에 영향을 주지 않는 되돌림 단어 쌍들을 제거합니다.
3. 루프 검출 : 승패 여부를 반전시키는 루프 단어를 검출합니다.
4. 2차 승패 분류 : 루프 단어를 고려하여 남은 글자를 조건부 승리, 조건부 패배, 루트 글자로 분류합니다.
5. 강한 연결 요소 추출 : 루트 글자를 주요 루트 글자, 희귀 루트 글자 분류로 분류합니다.
