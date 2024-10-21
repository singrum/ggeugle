import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { WordBadge, WordBox, WordContent } from "@/components/ui/WordBox";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useMenu } from "@/lib/store/useMenu";
import { sampleRules, useWC } from "@/lib/store/useWC";
import { choice, cn } from "@/lib/utils";
import { changeableMap, reverseChangeableMap } from "@/lib/wc/changeables";
import {
  CharSearchResult,
  NoncharSearchResult,
  WCDisplay,
  WordType,
} from "@/lib/wc/WordChain";
import { josa } from "es-hangul";
import { isEqual } from "lodash";
import { AlertCircle, ArrowRight, ChevronDown, CircleHelp } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Analysis from "./Analysis";
import SolutionTree from "./SolutionTree";

export default function SearchResult() {
  return (
    <div className="">
      <WordsResult />
      <div className="h-[50vh]" />
    </div>
  );
}

const tabInfo = [
  { name: "첫 글자" },
  { name: "끝 글자" },
  { name: "전략 탐색" },
  { name: "두음 법칙" },
];
const wins = [
  "강",
  "가",
  "소",
  "례",
  "예",
  "린",
  "인",
  "전",
  "방",
  "자",
  "호",
  "각",
  "고",
  "본",
  "간",
  "사",
  "물",
  "감",
  "법",
  "산",
  "제",
  "역",
  "관",
  "휘",
  "판",
  "형",
  "개",
  "비",
  "객",
  "갸",
  "글",
  "날",
  "절",
  "표",
  "거",
  "지",
  "처",
  "게",
  "과",
  "기",
  "이",
  "채",
  "세",
  "집",
  "격",
  "차",
  "금",
  "화",
  "대",
  "구",
  "점",
  "류",
  "유",
  "쟁",
  "안",
  "의",
  "경",
  "일",
  "계",
  "도",
  "부",
  "약",
  "정",
  "주",
  "포",
  "건",
  "적",
  "헌",
  "마",
  "한",
  "곡",
  "보",
  "선",
  "골",
  "공",
  "살",
  "로",
  "노",
  "상",
  "품",
  "실",
  "육",
  "목",
  "심",
  "반",
  "치",
  "속",
  "광",
  "교",
  "행",
  "옥",
  "원",
  "재",
  "명",
  "국",
  "회",
  "군",
  "악",
  "진",
  "극",
  "단",
  "용",
  "장",
  "배",
  "근",
  "독",
  "병",
  "분",
  "리",
  "급",
  "률",
  "율",
  "생",
  "래",
  "내",
  "달",
  "해",
  "조",
  "새",
  "나",
  "다",
  "라",
  "순",
  "어",
  "트",
  "와",
  "난",
  "음",
  "납",
  "언",
  "니",
  "청",
  "력",
  "귀",
  "샤",
  "녀",
  "여",
  "녁",
  "년",
  "연",
  "작",
  "퀴",
  "염",
  "꽃",
  "초",
  "레",
  "눈",
  "덕",
  "섯",
  "아",
  "풀",
  "디",
  "람",
  "남",
  "베",
  "무",
  "끼",
  "벌",
  "바",
  "들",
  "깨",
  "뼈",
  "말",
  "체",
  "양",
  "홈",
  "멍",
  "늘",
  "쇠",
  "질",
  "추",
  "힘",
  "능",
  "성",
  "데",
  "님",
  "임",
  "닛",
  "잇",
  "스",
  "빵",
  "닥",
  "수",
  "철",
  "박",
  "석",
  "닭",
  "담",
  "범",
  "설",
  "줄",
  "서",
  "련",
  "돈",
  "동",
  "합",
  "졸",
  "두",
  "모",
  "쌈",
  "위",
  "매",
  "에",
  "림",
  "밤",
  "밭",
  "듁",
  "드",
  "너",
  "봉",
  "티",
  "등",
  "알",
  "케",
  "테",
  "락",
  "낙",
  "꼴",
  "옷",
  "윷",
  "갑",
  "통",
  "란",
  "잠",
  "당",
  "신",
  "랏",
  "낫",
  "랑",
  "미",
  "쌀",
  "파",
  "랒",
  "낮",
  "곳",
  "떡",
  "밥",
  "루",
  "누",
  "움",
  "침",
  "코",
  "시",
  "량",
  "돌",
  "록",
  "녹",
  "려",
  "층",
  "렴",
  "령",
  "영",
  "빗",
  "색",
  "씨",
  "천",
  "창",
  "요",
  "돛",
  "띠",
  "만",
  "막",
  "망",
  "늬",
  "링",
  "잉",
  "왈",
  "외",
  "면",
  "칼",
  "론",
  "논",
  "료",
  "것",
  "탕",
  "슬",
  "젖",
  "착",
  "프",
  "출",
  "크",
  "좀",
  "짐",
  "탄",
  "길",
  "헨",
  "그",
  "웨",
  "를",
  "끈",
  "솔",
  "끝",
  "패",
  "활",
  "릉",
  "딜",
  "맏",
  "냐",
  "피",
  "김",
  "울",
  "온",
  "페",
  "빛",
  "괴",
  "굴",
  "둥",
  "뚝",
  "솥",
  "중",
  "터",
  "불",
  "엘",
  "똥",
  "립",
  "입",
  "메",
  "허",
  "종",
  "문",
  "때",
  "곰",
  "렬",
  "열",
  "발",
  "백",
  "네",
  "르",
  "느",
  "왕",
  "복",
  "친",
  "춤",
  "키",
  "편",
  "빈",
  "삼",
  "억",
  "올",
  "손",
  "숙",
  "술",
  "러",
  "브",
  "액",
  "총",
  "뉴",
  "펠",
  "접",
  "샘",
  "숨",
  "승",
  "엄",
  "풍",
  "털",
  "끌",
  "암",
  "압",
  "앙",
  "애",
  "야",
  "취",
  "얌",
  "옹",
  "엽",
  "북",
  "우",
  "운",
  "뜰",
  "톨",
  "웃",
  "워",
  "월",
  "먹",
  "탁",
  "은",
  "꿀",
  "밀",
  "봄",
  "빚",
  "릭",
  "익",
  "벨",
  "저",
  "젓",
  "덤",
  "훈",
  "캐",
  "젤",
  "클",
  "텔",
  "존",
  "책",
  "죄",
  "퍼",
  "향",
  "찌",
  "찜",
  "징",
  "짜",
  "핵",
  "하",
  "찬",
  "찰",
  "첨",
  "촌",
  "농",
  "칠",
  "타",
  "탈",
  "탐",
  "태",
  "토",
  "투",
  "평",
  "폰",
  "필",
  "함",
  "항",
  "환",
  "황",
  "후",
  "훼",
  "흥",
  "플",
  "히",
  "갓",
  "답",
  "둘",
  "별",
  "삽",
  "검",
  "오",
  "응",
  "갈",
  "칙",
  "퇴",
  "혈",
  "혼",
  "걸",
  "곤",
  "념",
  "흙",
  "댱",
  "맥",
  "즘",
  "랍",
  "략",
  "룡",
  "몰",
  "민",
  "번",
  "슈",
  "폐",
  "잡",
  "참",
  "녑",
  "충",
  "짝",
  "팥",
  "셈",
  "헐",
  "협",
  "긴",
  "늪",
  "닙",
  "젠",
  "램",
  "닌",
  "롱",
  "쥐",
  "덩",
  "삿",
  "웜",
  "땅",
  "삯",
  "짚",
  "짬",
  "긔",
  "뎨",
  "몽",
  "탑",
  "쪽",
  "할",
  "몸",
  "팔",
  "훠",
  "께",
  "콩",
  "겨",
  "굿",
  "꿰",
  "꾸",
  "묵",
  "냥",
  "녕",
  "떼",
  "블",
  "턱",
  "섬",
  "듀",
  "펄",
  "쯔",
  "숯",
  "렵",
  "팀",
  "폭",
  "횡",
  "같",
  "갱",
  "맨",
  "깔",
  "더",
  "딸",
  "랄",
  "빙",
  "뻘",
  "킷",
  "옴",
  "짓",
  "최",
  "잔",
  "갤",
  "갯",
  "믈",
  "솜",
  "륙",
  "쥬",
  "냉",
  "칸",
  "덜",
  "곱",
  "랭",
  "왓",
  "멀",
  "뒤",
  "붓",
  "윈",
  "왜",
  "즈",
  "걱",
  "쉬",
  "뜸",
  "얼",
  "완",
  "겔",
  "댕",
  "카",
  "흑",
  "측",
  "겉",
  "뜻",
  "벼",
  "잣",
  "흐",
  "볼",
  "커",
  "팩",
  "쒜",
  "휴",
  "엉",
  "벅",
  "콜",
  "힐",
  "젼",
  "셩",
  "딴",
  "겹",
  "혀",
  "홀",
  "닐",
  "텁",
  "곁",
  "푼",
  "쌍",
  "까",
  "든",
  "펜",
  "딕",
  "뇨",
  "킹",
  "끄",
  "뿌",
  "센",
  "셋",
  "믿",
  "땜",
  "쵸",
  "팜",
  "낚",
  "팽",
  "됴",
  "쿠",
  "곧",
  "덴",
  "앗",
  "솝",
  "팬",
  "팡",
  "푸",
  "얘",
  "킬",
  "뻬",
  "넬",
  "되",
  "싹",
  "버",
  "괭",
  "콘",
  "눌",
  "닉",
  "룬",
  "텅",
  "롯",
  "놋",
  "릿",
  "멘",
  "쥔",
  "놀",
  "쪼",
  "헝",
  "굼",
  "밧",
  "궈",
  "밋",
  "셀",
  "낱",
  "귓",
  "볏",
  "몬",
  "덧",
  "싸",
  "픽",
  "빌",
  "헤",
  "릴",
  "귿",
  "머",
  "롤",
  "쎄",
  "빨",
  "특",
  "뉵",
  "싱",
  "벋",
  "깜",
  "쇼",
  "꺼",
  "껍",
  "꼬",
  "뇽",
  "꼭",
  "꼼",
  "꼽",
  "꽁",
  "꾀",
  "뭇",
  "샛",
  "뵈",
  "렌",
  "캡",
  "닝",
  "앵",
  "낟",
  "옻",
  "쓰",
  "쉐",
  "셰",
  "켄",
  "냅",
  "넉",
  "넌",
  "넝",
  "넓",
  "넙",
  "넥",
  "넵",
  "녈",
  "튀",
  "던",
  "앞",
  "쟝",
  "늦",
  "늿",
  "폴",
  "롄",
  "옌",
  "섹",
  "뤼",
  "윗",
  "홰",
  "릎",
  "닫",
  "홉",
  "찐",
  "댓",
  "컨",
  "멜",
  "뎃",
  "젹",
  "뎍",
  "뎐",
  "땡",
  "숫",
  "된",
  "될",
  "씰",
  "컷",
  "뒷",
  "콕",
  "칡",
  "랴",
  "엠",
  "엇",
  "딥",
  "따",
  "딱",
  "뚜",
  "땍",
  "땔",
  "땟",
  "떠",
  "떨",
  "떫",
  "뙤",
  "뜨",
  "찔",
  "뜬",
  "햄",
  "웰",
  "첼",
  "헬",
  "랜",
  "랩",
  "뷰",
  "렉",
  "렙",
  "쿤",
  "뢴",
  "룰",
  "맔",
  "맞",
  "멧",
  "며",
  "묏",
  "묶",
  "믠",
  "밴",
  "큐",
  "받",
  "쭈",
  "뱃",
  "펭",
  "썩",
  "벤",
  "콧",
  "죡",
  "붉",
  "뷘",
  "톰",
  "튜",
  "뺑",
  "쌔",
  "왁",
  "펀",
  "릊",
  "삳",
  "퉁",
  "샐",
  "섀",
  "섞",
  "섣",
  "셉",
  "솁",
  "콤",
  "툴",
  "숩",
  "엥",
  "싼",
  "써",
  "쏠",
  "쑹",
  "쓴",
  "쓸",
  "씬",
  "쩡",
  "풋",
  "앉",
  "앏",
  "앤",
  "퀸",
  "얕",
  "엎",
  "펙",
  "엮",
  "옐",
  "옭",
  "왱",
  "왼",
  "윌",
  "잭",
  "으",
  "잦",
  "잰",
  "잿",
  "죗",
  "짠",
  "짧",
  "쬐",
  "찻",
  "챈",
  "첫",
  "촐",
  "쵯",
  "캘",
  "콰",
  "쾰",
  "퀵",
  "퀼",
  "큰",
  "텩",
  "펩",
  "퓌",
  "픐",
  "햇",
  "햐",
  "헛",
  "헥",
  "혓",
  "홑",
  "훳",
  "휜",
  "흰",
  "힝",
];

const loses = ["꾼", "값", "릇", "틴", "윰", "듭", "즙", "슨", "녘"];

const routes = [
  "겁",
  "견",
  "결",
  "겸",
  "곶",
  "곽",
  "괘",
  "굉",
  "굽",
  "궁",
  "권",
  "궐",
  "궤",
  "규",
  "균",
  "귤",
  "깃",
  "꽂",
  "꽝",
  "꿈",
  "낭",
  "뇌",
  "늉",
  "늑",
  "늠",
  "닢",
  "둑",
  "둔",
  "듕",
  "득",
  "뢰",
  "륜",
  "륭",
  "륵",
  "름",
  "맹",
  "멱",
  "멸",
  "못",
  "묘",
  "밑",
  "밖",
  "벗",
  "벙",
  "벽",
  "변",
  "붕",
  "삭",
  "섭",
  "송",
  "습",
  "식",
  "십",
  "업",
  "욱",
  "웅",
  "윤",
  "융",
  "을",
  "읍",
  "잎",
  "좌",
  "죽",
  "준",
  "즉",
  "직",
  "척",
  "첩",
  "촉",
  "축",
  "춘",
  "칭",
  "캄",
  "켠",
  "택",
  "폄",
  "핍",
  "험",
  "혁",
  "현",
  "홍",
  "확",
  "획",
  "효",
  "흉",
  "흔",
  "흡",
  "희",
];

function WordsResult() {
  const [
    searchResult,
    engine,
    searchInputValue,
    setSearchInputValue,

    setValue,
    exceptWords,
    setExceptWords,
    rule,
  ] = useWC((e) => [
    e.searchResult,
    e.engine,
    e.searchInputValue,
    e.setSearchInputValue,
    e.setValue,
    e.exceptWords,
    e.setExceptWords,
    e.rule,
  ]);
  const [setMenu] = useMenu((e) => [e.setMenu]);
  const [showAllWords] = useCookieSettings((e) => [e.showAllWords]);
  const [tab, setTab] = useState<number>(0);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);

  const charType =
    engine &&
    searchInputValue &&
    WCDisplay.getCharType(engine, searchInputValue);
  useEffect(() => {
    setIsMoreOpen(false);
  }, [searchInputValue]);
  const startMenuInfo = useMemo(
    () => ({
      winChar: choice(wins),
      losChar: choice(loses),
      route: choice(routes),
    }),
    [searchInputValue.length === 0]
  );
  const isGuelrule = useMemo(
    () => isEqual(sampleRules[0].ruleForm, rule),
    [rule]
  );
  const showShowcase =
    isGuelrule && searchInputValue.length === 0 && exceptWords.length === 0;
  return (
    <>
      <div className="shadow-[inset_0_-1px_0_0_hsl(var(--border))] px-6 flex whitespace-nowrap overflow-auto gap-4 w-full min-h-1">
        {searchInputValue.length >= 1 &&
          tabInfo.map(({ name }, i) => (
            <div
              key={i}
              className={cn(
                "text-muted-foreground cursor-pointer transition-colors border-b-2 border-transparent py-2 text-base select-none hover:text-foreground",
                {
                  "text-foreground border-foreground": tab === i,
                }
              )}
              onClick={() => setTab(i)}
            >
              {name}
            </div>
          ))}
      </div>
      {showShowcase ? (
        <>
          <div className="p-4 pb-0">
            <Alert className="">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-normal">
                현재 설정된 룰은 <span className="font-semibold">구엜룰</span>
                입니다.
              </AlertTitle>
              <AlertDescription>
                끄글에서는 신엜룰, 넶룰, 끄투룰, 앞말잇기 등 다양한 끝말잇기
                룰을 설정할 수 있습니다.
                <div
                  className="hover:underline underline-offset-2 text-primary font-semibold select-none cursor-pointer flex items-center mt-2"
                  onClick={() => setMenu(3)}
                >
                  설정하러 가기
                  <ArrowRight className="w-4 h-4" />
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <div className="m-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShowcaseBtn
              onClick={() => {
                if (!engine) return;
                setSearchInputValue(startMenuInfo.winChar);
                setValue(startMenuInfo.winChar);
                setTab(0);
              }}
            >
              <span className="font-semibold">{startMenuInfo.winChar}</span>
              {josa(startMenuInfo.winChar, "으로/로").slice(1)} 시작하는
              공격 단어
            </ShowcaseBtn>
            <ShowcaseBtn
              onClick={() => {
                if (!engine) return;
                setSearchInputValue(startMenuInfo.losChar);
                setValue(startMenuInfo.losChar);
                setTab(1);
              }}
            >
              <span className="font-semibold">{startMenuInfo.losChar}</span>
              {josa(startMenuInfo.losChar, "으로/로").slice(1)} 끝나는 단어
            </ShowcaseBtn>
            <ShowcaseBtn
              onClick={() => {
                if (!engine) return;
                setSearchInputValue(startMenuInfo.route);
                setValue(startMenuInfo.route);
                setTab(0);
              }}
            >
              <span className="font-semibold">{startMenuInfo.route}</span>
              {josa(startMenuInfo.route, "으로/로").slice(1)} 시작하는 루트 단어
            </ShowcaseBtn>
            <ShowcaseBtn
              onClick={() => {
                if (!engine) return;
                setSearchInputValue("름");
                setValue("름");
                setTab(2);
                setExceptWords(["굉굉", "굉업", "업시름"]);
              }}
            >
              <span className="font-semibold">굉굉 - 굉업 - 업시름</span> 이후
              필승 전략
            </ShowcaseBtn>
          </div>
        </>
      ) : (
        <>
          {tab === 0 &&
            (engine ? (
              searchResult && (
                <>
                  <div className="flex-1 min-h-0 flex flex-col px-4">
                    {searchResult.isChar ? (
                      <>
                        {(searchResult.result as CharSearchResult).startsWith
                          .win.length > 0 &&
                          (
                            searchResult.result as CharSearchResult
                          ).startsWith.win.map((e, i) => (
                            <React.Fragment key={i}>
                              <WordBox>
                                <WordBadge>{`${e.endNum}턴 후 승리`}</WordBadge>
                                <WordContent
                                  wordInfo={e.words.map((word) => ({
                                    word,
                                    type: "win",
                                  }))}
                                />
                              </WordBox>

                              <Separator />
                            </React.Fragment>
                          ))}
                        {(searchResult.result as CharSearchResult).startsWith
                          .wincir.length > 0 &&
                          (searchResult.result as CharSearchResult).startsWith
                            .wincir.length && (
                            <React.Fragment>
                              <WordBox>
                                <WordBadge>{`조건부 승리`}</WordBadge>
                                <WordContent
                                  wordInfo={(
                                    searchResult.result as CharSearchResult
                                  ).startsWith.wincir.map((word) => ({
                                    word,
                                    type: "win",
                                  }))}
                                />
                              </WordBox>
                              <Separator />
                            </React.Fragment>
                          )}
                        {(charType !== "win" || isMoreOpen || showAllWords) && (
                          <>
                            {(searchResult.result as CharSearchResult)
                              .startsWith.route.length > 0 && (
                              <>
                                <WordBox>
                                  <WordBadge>{`루트 단어`}</WordBadge>
                                  <WordContent
                                    wordInfo={
                                      (searchResult.result as CharSearchResult)
                                        .startsWith.route
                                        ? (
                                            searchResult.result as CharSearchResult
                                          ).startsWith.route.map((word) => ({
                                            word,
                                            type: "route",
                                          }))
                                        : []
                                    }
                                  />
                                </WordBox>
                                <Separator />
                              </>
                            )}
                            {(searchResult.result as CharSearchResult)
                              .startsWith.return.length > 0 && (
                              <>
                                <WordBox>
                                  <Popover>
                                    <PopoverTrigger>
                                      <WordBadge>
                                        {`되돌림 단어`}
                                        <CircleHelp className="w-4 h-4" />
                                      </WordBadge>
                                    </PopoverTrigger>
                                    <PopoverContent className="text-sm">
                                      되돌림 단어들의 유무는 승패 여부에 영향을
                                      주지 않습니다.
                                    </PopoverContent>
                                  </Popover>
                                  <WordContent
                                    wordInfo={
                                      (searchResult.result as CharSearchResult)
                                        .startsWith.return
                                        ? (
                                            searchResult.result as CharSearchResult
                                          ).startsWith.return.map((word) => ({
                                            word,
                                            type: "muted-foreground",
                                          }))
                                        : []
                                    }
                                  />
                                </WordBox>
                                <Separator />
                              </>
                            )}
                            {(charType !== "route" ||
                              isMoreOpen ||
                              showAllWords) && (
                              <>
                                {(searchResult.result as CharSearchResult)
                                  .startsWith.loscir.length > 0 && (
                                  <>
                                    <WordBox>
                                      <WordBadge>{`조건부 패배`}</WordBadge>
                                      <WordContent
                                        wordInfo={
                                          (
                                            searchResult.result as CharSearchResult
                                          ).startsWith.loscir
                                            ? (
                                                searchResult.result as CharSearchResult
                                              ).startsWith.loscir.map(
                                                (word) => ({
                                                  word,
                                                  type: "los",
                                                })
                                              )
                                            : []
                                        }
                                      />
                                    </WordBox>
                                    <Separator />
                                  </>
                                )}
                                {(searchResult.result as CharSearchResult)
                                  .startsWith.los.length > 0 &&
                                  (
                                    searchResult.result as CharSearchResult
                                  ).startsWith.los.map((e, i) => (
                                    <React.Fragment key={i}>
                                      <WordBox>
                                        <WordBadge>{`${e.endNum}턴 후 패배`}</WordBadge>
                                        <WordContent
                                          wordInfo={e.words.map((word) => ({
                                            word,
                                            type: "los",
                                          }))}
                                        />
                                      </WordBox>
                                      <Separator />
                                    </React.Fragment>
                                  ))}
                              </>
                            )}
                          </>
                        )}
                        {!showAllWords && !isMoreOpen && charType !== "los" && (
                          <div
                            className="p-4 flex justify-center text-primary items-center gap-1 select-none cursor-pointer hover:opacity-75"
                            onClick={() => setIsMoreOpen(true)}
                          >
                            {charType === "win"
                              ? "루트 단어, 패배 단어 펼치기"
                              : "패배 단어 펼치기"}
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        )}
                      </>
                    ) : (
                      (searchResult.result as NoncharSearchResult).startsWith
                        .length > 0 && (
                        <>
                          <WordBox>
                            <WordContent
                              wordInfo={(
                                searchResult.result as NoncharSearchResult
                              ).startsWith.map((word) => ({
                                word,
                                type: WCDisplay.reduceWordtype(
                                  WCDisplay.getWordType(engine!, word)
                                    .type as WordType
                                ),
                              }))}
                            />
                          </WordBox>
                          <Separator />
                        </>
                      )
                    )}
                  </div>
                </>
              )
            ) : (
              <WordSkeleton />
            ))}

          {tab === 1 &&
            (engine ? (
              searchResult && (
                <>
                  <div className="flex-1 min-h-0 flex flex-col px-4">
                    {searchResult.isChar === true ? (
                      <>
                        {(searchResult.result as CharSearchResult).endsWith
                          .head_los.length > 0 && (
                          <React.Fragment>
                            <WordBox>
                              <WordContent
                                wordInfo={(
                                  searchResult.result as CharSearchResult
                                ).endsWith.head_los.map((word) => ({
                                  word,
                                  type: WCDisplay.reduceWordtypeWithReturn(
                                    WCDisplay.getWordType(engine!, word)
                                      .type as WordType
                                  ),
                                }))}
                                endsWith={true}
                              />
                            </WordBox>
                            <Separator />
                          </React.Fragment>
                        )}
                        {(searchResult.result as CharSearchResult).endsWith
                          .head_route.length > 0 && (
                          <React.Fragment>
                            <WordBox>
                              <WordContent
                                wordInfo={(
                                  searchResult.result as CharSearchResult
                                ).endsWith.head_route.map((word) => ({
                                  word,
                                  type: WCDisplay.reduceWordtypeWithReturn(
                                    WCDisplay.getWordType(engine!, word)
                                      .type as WordType
                                  ),
                                }))}
                                endsWith={true}
                              />
                            </WordBox>
                            <Separator />
                          </React.Fragment>
                        )}
                        {(searchResult.result as CharSearchResult).endsWith.rest
                          .length > 0 && (
                          <>
                            <WordBox>
                              <WordContent
                                wordInfo={(
                                  searchResult.result as CharSearchResult
                                ).endsWith.rest.map((word) => ({
                                  word,
                                  type: WCDisplay.reduceWordtypeWithReturn(
                                    WCDisplay.getWordType(engine!, word)
                                      .type as WordType
                                  ),
                                }))}
                                endsWith={true}
                              />
                            </WordBox>
                            <Separator />
                          </>
                        )}
                      </>
                    ) : (
                      (searchResult.result as NoncharSearchResult).endsWith
                        .length > 0 && (
                        <>
                          <WordBox>
                            <WordContent
                              wordInfo={(
                                searchResult.result as NoncharSearchResult
                              ).endsWith.map((word) => ({
                                word,
                                type: WCDisplay.reduceWordtype(
                                  WCDisplay.getWordType(engine!, word)
                                    .type as WordType
                                ),
                              }))}
                              endsWith={true}
                            />
                          </WordBox>
                          <Separator />
                        </>
                      )
                    )}
                  </div>
                </>
              )
            ) : (
              <WordSkeleton />
            ))}

          {tab === 2 && engine && (
            <>
              {engine.chanGraph.nodes[searchInputValue]?.type === "route" ? (
                <div className="p-4">
                  <Analysis />
                </div>
              ) : (
                (engine.chanGraph.nodes[searchInputValue]?.type === "win" ||
                  engine.chanGraph.nodes[searchInputValue]?.type === "los" ||
                  engine.chanGraph.nodes[searchInputValue]?.type === "wincir" ||
                  engine.chanGraph.nodes[searchInputValue]?.type ===
                    "loscir") && <SolutionTree />
              )}
            </>
          )}
          {tab === 3 && engine && searchInputValue.length === 1 && (
            <div className="flex-1 min-h-0 flex flex-col px-4">
              <WordBox>
                <WordBadge>{`${searchInputValue}에서 바꿀 수 있는 글자`}</WordBadge>
                <WordContent
                  notExcept={true}
                  wordInfo={changeableMap[engine.rule.changeableIdx](
                    searchInputValue
                  ).map((char) => ({
                    word: char,
                    type: engine.wordGraph.nodes[char]
                      ? WCDisplay.reduceWordtype(
                          engine.wordGraph.nodes[char].type as WordType
                        )
                      : "los",
                  }))}
                />
              </WordBox>
              <Separator />

              <WordBox>
                <WordBadge>{`${josa(
                  searchInputValue,
                  "으로/로"
                )} 바꿀 수 있는 글자`}</WordBadge>
                <WordContent
                  notExcept={true}
                  wordInfo={reverseChangeableMap[engine.rule.changeableIdx](
                    searchInputValue
                  ).map((char) => ({
                    word: char,
                    type: engine.wordGraph.nodes[char]
                      ? (WCDisplay.reduceWordtype(
                          engine.chanGraph.nodes[char].type as WordType
                        ) as "win" | "los" | "route")
                      : WCDisplay.getCharType(engine, char),
                  }))}
                />
              </WordBox>
              <Separator />
            </div>
          )}
        </>
      )}
    </>
  );
}

function WordSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col px-4">
      <>
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
        <WordBox>
          <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
            {Array(20)
              .fill(0)
              .map((_, i) =>
                Math.random() < 0.5 ? (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                ) : (
                  <Skeleton
                    className="py-1 px-3 text-transparent rounded-full text-sm"
                    key={i}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Skeleton>
                )
              )}
          </div>
        </WordBox>
        <Separator />
      </>
    </div>
  );
}

const ShowcaseBtn = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 rounded-xl text-lg flex bg-accent text-accent-foreground gap-2 select-none cursor-pointer ",
      className
    )}
    {...props}
  >
    <div className="flex-1">{children}</div>
    <ArrowRight className="w-5 h-5 mt-1" />
  </div>
));
