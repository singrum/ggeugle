# 끝말잇기 엔진

끝말잇기 엔진은 끝말잇기 단어 검색과 끝말잇기 게임 분석을 위한 웹 서비스입니다. (구 끄글)

[https://engine.ikki.app](https://engine.ikki.app)

## 주요 기능

- 승패에 따른 음절 및 단어 분류
- 고전적 인공지능 기반의 필승 전략 탐색 알고리즘 적용
- 컴퓨터(AI)와의 실시간 대결 인터페이스
- 게임 규칙 맞춤 설정 지원

## 신규 기능

- 음절 및 단어 분류 알고리즘 속도 향상
- 음절 위치 선택(첫 음절 / 끝 음절) 기능 추가
- 음절 4유형, 단어 6유형으로 세분화된 분류 제공
- 강한 연결 요소, 음절별 이전/다음 단어 분포 기능
- 룰 설정 시 다음 단어 개수 제한 옵션 추가
- 임계 단어 제외 결과를 실시간으로 표시
- 여러 단어의 필승 전략을 동시에 탐색 가능
- 전략 탐색 시 다음 단어 우선순위 편집 가능
- 빠른 룰 설정 시 URL에 상태 저장 및 새로고침 시 유지
- 단어 검색 시 Regex 사용 가능

## 탐색 성능 벤치마크
총 루트 단어 : **587**  
탐색 성공 : **225**
<details>
<summary>
자세히 보기
</summary>


| 시작 단어 | 승패 여부 | 탐색 시간(sec) |
| --------- | --------- | -------------- |
| 겁결      | <span style="color:red">패</span>        | 3.5            |
| 견득      | <span style="color:red">패</span>        | 12.19          |
| 견효      | <span style="color:red">패</span>        | 0.33           |
| 견묘      | <span style="color:red">패</span>        | 0.3            |
| 견습      | <span style="color:red">패</span>        | 0.52           |
| 견이불식  | <span style="color:red">패</span>        | 0.33           |
| 견방직    | <span style="color:red">패</span>        | 0.36           |
| 결벽      | <span style="color:red">패</span>        | 0.37           |
| 결획      | <span style="color:blue">승</span>        | 5.8            |
| 결단식    | <span style="color:red">패</span>        | 0.52           |
| 결결      | <span style="color:red">패</span>        | 5.19           |
| 결가부좌  | <span style="color:red">패</span>        | 0.37           |
| 겸업      | <span style="color:blue">승</span>        | 0.29           |
| 겸지우겸  | <span style="color:red">패</span>        | 0.56           |
| 겸직      | <span style="color:red">패</span>        | 0.46           |
| 겸득      | <span style="color:red">패</span>        | 22.64          |
| 곶닢      | <span style="color:red">패</span>        | 0.21           |
| 곽재겸    | <span style="color:red">패</span>        | 0.2            |
| 괘사직    | <span style="color:red">패</span>        | 0.21           |
| 괘하현    | <span style="color:red">패</span>        | 0.24           |
| 괘효      | <span style="color:red">패</span>        | 0.4            |
| 굉업      | <span style="color:blue">승</span>        | 8.35           |
| 굉굉      | <span style="color:red">패</span>        | 1.02           |
| 굉재탁식  | <span style="color:red">패</span>        | 0.4            |
| 굉규      | <span style="color:red">패</span>        | 0.63           |
| 굽벽      | <span style="color:red">패</span>        | 0.27           |
| 궁듕      | <span style="color:blue">승</span>        | 2.08           |
| 궁깃      | <span style="color:red">패</span>        | 2.45           |
| 궁궐      | <span style="color:red">패</span>        | 0.41           |
| 궁장식    | <span style="color:red">패</span>        | 0.55           |
| 궁궁      | <span style="color:red">패</span>        | 1.97           |
| 궁사멱득  | <span style="color:red">패</span>        | 26.42          |
| 궁결      | <span style="color:red">패</span>        | 7.81           |
| 권벽      | <span style="color:red">패</span>        | 4.56           |
| 권유식    | <span style="color:red">패</span>        | 0.9            |
| 권설직    | <span style="color:red">패</span>        | 0.97           |
| 권덕규    | <span style="color:red">패</span>        | 3.72           |
| 권굉      | <span style="color:red">패</span>        | 23.17          |
| 권뢰      | <span style="color:red">패</span>        | 13.75          |
| 권중현    | <span style="color:red">패</span>        | 1.07           |
| 권전법륜  | <span style="color:red">패</span>        | 4.27           |
| 권삼득    | <span style="color:red">패</span>        | 20.17          |
| 궐획      | <span style="color:blue">승</span>        | 0.37           |
| 궐직      | <span style="color:red">패</span>        | 0.36           |
| 궤도업    | <span style="color:blue">승</span>        | 0.25           |
| 궤촉      | <span style="color:blue">승</span>        | 0.98           |
| 궤직      | <span style="color:red">패</span>        | 0.28           |
| 궤좌      | <span style="color:red">패</span>        | 0.24           |
| 규획      | <span style="color:blue">승</span>        | 0.45           |
| 규범의식  | <span style="color:red">패</span>        | 0.37           |
| 규규      | <span style="color:red">패</span>        | 0.57           |
| 규벽      | <span style="color:red">패</span>        | 0.72           |
| 규결      | <span style="color:red">패</span>        | 7.74           |
| 균습      | <span style="color:red">패</span>        | 0.31           |
| 균현      | <span style="color:red">패</span>        | 0.38           |
| 균륜      | <span style="color:red">패</span>        | 2.8            |
| 귤잎      | <span style="color:red">패</span>        | 0.2            |
| 깃꼴잎    | <span style="color:red">패</span>        | 0.18           |
| 깃촉      | <span style="color:blue">승</span>        | 0.49           |
| 꽂임촉    | <span style="color:blue">승</span>        | 1.27           |
| 꿈결      | <span style="color:red">패</span>        | 3.07           |
| 낭자궤    | <span style="color:red">패</span>        | 0.24           |
| 낭랑묘    | <span style="color:red">패</span>        | 0.42           |
| 낭유도식  | <span style="color:red">패</span>        | 0.26           |
| 낭비벽    | <span style="color:red">패</span>        | 0.63           |
| 뇌홍      | <span style="color:red">패</span>        | 0.27           |
| 뇌뢰      | <span style="color:red">패</span>        | 8.93           |
| 뇌굉      | <span style="color:red">패</span>        | 10.64          |
| 뇌궁      | <span style="color:red">패</span>        | 1.38           |
| 늠식      | <span style="color:red">패</span>        | 0.19           |
| 둑신묘    | <span style="color:red">패</span>        | 0.28           |
| 듕깃      | <span style="color:red">패</span>        | 0.58           |
| 득도식    | <span style="color:red">패</span>        | 0.28           |
| 득롱망촉  | <span style="color:blue">승</span>        | 4.86           |
| 득업      | <span style="color:blue">승</span>        | 19.74          |
| 뢰촉      | <span style="color:blue">승</span>        | 1.7            |
| 뢰명산붕  | <span style="color:red">패</span>        | 6.92           |
| 뢰홍      | <span style="color:red">패</span>        | 0.46           |
| 륜습      | <span style="color:red">패</span>        | 0.29           |
| 륜직      | <span style="color:red">패</span>        | 0.44           |
| 륜좌      | <span style="color:red">패</span>        | 0.47           |
| 맹벽      | <span style="color:red">패</span>        | 0.34           |
| 맹묘      | <span style="color:red">패</span>        | 0.32           |
| 맹습      | <span style="color:red">패</span>        | 0.24           |
| 맹홍      | <span style="color:red">패</span>        | 0.24           |
| 멱득      | <span style="color:red">패</span>        | 15.9           |
| 묘획      | <span style="color:blue">승</span>        | 0.25           |
| 묘식      | <span style="color:red">패</span>        | 0.22           |
| 묘직      | <span style="color:red">패</span>        | 0.21           |
| 묘윤      | <span style="color:red">패</span>        | 2.12           |
| 묘득      | <span style="color:red">패</span>        | 18.12          |
| 밑깃      | <span style="color:red">패</span>        | 1.41           |
| 밑열이식  | <span style="color:red">패</span>        | 0.38           |
| 밖벽      | <span style="color:red">패</span>        | 0.26           |
| 벽읍      | <span style="color:blue">승</span>        | 0.23           |
| 변두리벽  | <span style="color:red">패</span>        | 0.59           |
| 변식      | <span style="color:red">패</span>        | 0.44           |
| 변혁      | <span style="color:red">패</span>        | 0.39           |
| 변궁      | <span style="color:red">패</span>        | 2.12           |
| 붕획      | <span style="color:blue">승</span>        | 6.42           |
| 붕결      | <span style="color:red">패</span>        | 4.82           |
| 삭직      | <span style="color:red">패</span>        | 0.41           |
| 섭식      | <span style="color:red">패</span>        | 0.19           |
| 섭육십    | <span style="color:red">패</span>        | 0.16           |
| 섭직      | <span style="color:red">패</span>        | 0.19           |
| 송화다식  | <span style="color:red">패</span>        | 0.26           |
| 송깃      | <span style="color:red">패</span>        | 1.96           |
| 송습      | <span style="color:red">패</span>        | 0.28           |
| 송치규    | <span style="color:red">패</span>        | 1.75           |
| 송뢰      | <span style="color:red">패</span>        | 17.57          |
| 습업      | <span style="color:blue">승</span>        | 0.17           |
| 습궐      | <span style="color:red">패</span>        | 0.28           |
| 습식      | <span style="color:red">패</span>        | 0.25           |
| 습직      | <span style="color:red">패</span>        | 0.25           |
| 습득      | <span style="color:red">패</span>        | 27.35          |
| 습벽      | <span style="color:red">패</span>        | 0.53           |
| 식업      | <span style="color:red">패</span>        | 0.38           |
| 식식      | <span style="color:red">패</span>        | 0.4            |
| 십불선업  | <span style="color:blue">승</span>        | 0.18           |
| 십년일득  | <span style="color:red">패</span>        | 11.82          |
| 십습      | <span style="color:red">패</span>        | 0.15           |
| 십장식    | <span style="color:red">패</span>        | 0.19           |
| 십자좌    | <span style="color:red">패</span>        | 0.19           |
| 업시름    | <span style="color:red">패</span>        | 0.14           |
| 욱은지붕  | <span style="color:red">패</span>        | 0.13           |
| 웅문거벽  | <span style="color:red">패</span>        | 0.14           |
| 웅묘      | <span style="color:red">패</span>        | 0.15           |
| 윤업      | <span style="color:blue">승</span>        | 1.06           |
| 윤동규    | <span style="color:red">패</span>        | 0.54           |
| 윤직      | <span style="color:red">패</span>        | 0.37           |
| 윤제홍    | <span style="color:red">패</span>        | 0.42           |
| 윤희결    | <span style="color:red">패</span>        | 6.53           |
| 융식      | <span style="color:red">패</span>        | 0.37           |
| 융궁      | <span style="color:red">패</span>        | 0.7            |
| 을미개혁  | <span style="color:red">패</span>        | 0.2            |
| 을묘      | <span style="color:red">패</span>        | 0.32           |
| 을좌      | <span style="color:red">패</span>        | 0.2            |
| 잎자욱    | <span style="color:blue">승</span>        | 0.13           |
| 좌업      | <span style="color:blue">승</span>        | 0.15           |
| 좌식      | <span style="color:red">패</span>        | 0.16           |
| 좌궁깃    | <span style="color:red">패</span>        | 1.52           |
| 좌우청촉  | <span style="color:blue">승</span>        | 7.14           |
| 좌직      | <span style="color:red">패</span>        | 0.18           |
| 좌현묘    | <span style="color:red">패</span>        | 0.29           |
| 좌보궐    | <span style="color:red">패</span>        | 0.34           |
| 좌규      | <span style="color:red">패</span>        | 1.62           |
| 좌향좌    | <span style="color:red">패</span>        | 0.32           |
| 좌윤      | <span style="color:red">패</span>        | 2.21           |
| 좌우궁    | <span style="color:red">패</span>        | 1.38           |
| 죽궤      | <span style="color:red">패</span>        | 0.3            |
| 죽궁      | <span style="color:red">패</span>        | 1.16           |
| 죽림칠현  | <span style="color:red">패</span>        | 0.31           |
| 준공식    | <span style="color:red">패</span>        | 0.31           |
| 준직      | <span style="color:red">패</span>        | 0.42           |
| 준좌      | <span style="color:red">패</span>        | 0.52           |
| 준뢰      | <span style="color:red">패</span>        | 12.26          |
| 즉위식    | <span style="color:red">패</span>        | 0.28           |
| 즉결      | <span style="color:red">패</span>        | 3.68           |
| 즉좌      | <span style="color:red">패</span>        | 0.4            |
| 즉효      | <span style="color:red">패</span>        | 0.31           |
| 직업      | <span style="color:blue">승</span>        | 0.42           |
| 직업의식  | <span style="color:red">패</span>        | 0.39           |
| 직결      | <span style="color:red">패</span>        | 5.64           |
| 직격뢰    | <span style="color:red">패</span>        | 13.92          |
| 직효      | <span style="color:red">패</span>        | 0.71           |
| 직사궁    | <span style="color:red">패</span>        | 1.71           |
| 척촌지효  | <span style="color:red">패</span>        | 0.4            |
| 척식      | <span style="color:red">패</span>        | 0.39           |
| 첩시꽂    | <span style="color:red">패</span>        | 0.69           |
| 촉식      | <span style="color:red">패</span>        | 0.18           |
| 촉규      | <span style="color:red">패</span>        | 0.19           |
| 촉직      | <span style="color:red">패</span>        | 0.2            |
| 촉륜      | <span style="color:red">패</span>        | 0.35           |
| 축하식    | <span style="color:red">패</span>        | 0.12           |
| 축세륜    | <span style="color:red">패</span>        | 0.36           |
| 춘식      | <span style="color:red">패</span>        | 0.23           |
| 춘뢰      | <span style="color:red">패</span>        | 1.72           |
| 춘대옥촉  | <span style="color:blue">승</span>        | 1.82           |
| 춘효      | <span style="color:red">패</span>        | 0.62           |
| 칭굉      | <span style="color:red">패</span>        | 0.29           |
| 칭병사직  | <span style="color:red">패</span>        | 0.25           |
| 칭송      | <span style="color:red">패</span>        | 5.02           |
| 캄캄절벽  | <span style="color:blue">승</span>        | 0.18           |
| 택식      | <span style="color:red">패</span>        | 0.12           |
| 폄직      | <span style="color:red">패</span>        | 0.17           |
| 폄좌      | <span style="color:red">패</span>        | 0.19           |
| 험결      | <span style="color:red">패</span>        | 0.3            |
| 험윤      | <span style="color:red">패</span>        | 0.6            |
| 험득      | <span style="color:red">패</span>        | 5.55           |
| 혁업      | <span style="color:blue">승</span>        | 0.17           |
| 혁직      | <span style="color:red">패</span>        | 0.17           |
| 혁현      | <span style="color:red">패</span>        | 0.17           |
| 현업      | <span style="color:blue">승</span>        | 0.33           |
| 현벽      | <span style="color:red">패</span>        | 0.54           |
| 현행계획  | <span style="color:blue">승</span>        | 0.4            |
| 현식      | <span style="color:red">패</span>        | 0.49           |
| 현촉      | <span style="color:blue">승</span>        | 12.24          |
| 현직      | <span style="color:red">패</span>        | 0.56           |
| 현묘      | <span style="color:red">패</span>        | 0.66           |
| 현순백결  | <span style="color:red">패</span>        | 6.07           |
| 현좌      | <span style="color:red">패</span>        | 0.45           |
| 현윤      | <span style="color:red">패</span>        | 3.6            |
| 홍업      | <span style="color:blue">승</span>        | 0.8            |
| 홍촉      | <span style="color:blue">승</span>        | 3.41           |
| 홍혁      | <span style="color:red">패</span>        | 0.55           |
| 홍만식    | <span style="color:red">패</span>        | 0.97           |
| 홍규      | <span style="color:red">패</span>        | 1.72           |
| 홍륜      | <span style="color:red">패</span>        | 2.23           |
| 홍벽      | <span style="color:red">패</span>        | 0.79           |
| 확효      | <span style="color:red">패</span>        | 0.28           |
| 획득      | <span style="color:red">패</span>        | 0.19           |
| 효근귤    | <span style="color:blue">승</span>        | 0.15           |
| 효창묘    | <span style="color:red">패</span>        | 0.25           |
| 효습      | <span style="color:red">패</span>        | 0.09           |
| 흉벽      | <span style="color:red">패</span>        | 0.31           |
| 흉겸      | <span style="color:red">패</span>        | 4.93           |
| 흔굉      | <span style="color:red">패</span>        | 8.95           |
| 흔캄      | <span style="color:blue">승</span>        | 0.3            |
| 흡음벽    | <span style="color:red">패</span>        | 0.26           |
| 흡습      | <span style="color:red">패</span>        | 0.27           |
| 흡현      | <span style="color:red">패</span>        | 0.25           |
| 희망퇴직  | <span style="color:red">패</span>        | 0.3            |
| 희견궁    | <span style="color:red">패</span>        | 1.17           |

</details>


## 커뮤니티

[Discord](https://discord.com/invite/bkHgyajx89)

## 파생 프로젝트

- 가가끄글 : [@tingtingplanet/gagageul](https://github.com/tingtingplanet/gagageul)  
 더 많은 전략 탐색 옵션 구현




