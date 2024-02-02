import { WCcontext } from "../../context/WCcontext";
import { useContext, useState, useCallback, useEffect } from "react";
import { Rule ,WCengine, Turn, LOS, WIN, LOSCIR, WINCIR, ROUTE} from "../../js/WordChain"
import Search from './Search';
import WordBox from "../presentation/WordBox";
import CharOffcanvas from "./CharOffcanvas";
import CharButtonCard from "../presentation/CharButtonCard";
import CharButton from "../presentation/CharButton";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 스무스한 애니메이션으로 스크롤 이동
  });
};



function SearchMode({display}) {
  const { WC, setWC } = useContext(WCcontext)
  const [offCanvasShow, setOffCanvasShow] = useState(false);
  const [charCards, setCharCards] = useState([]);
  const [wordCards, setWordCards] = useState([]);
  const [radioValue, setRadioValue] = useState('0');
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");


  const applySearch = useCallback(() => {
    if (!WC) { return; }
    const result = []
    if (WC.charMap[search]?.sorted === WIN) {
      
      const wc = WC.charMap[search].wordClass;
      for (let i of Object.keys(wc).filter(e => parseInt(e) >= 0)) {
        result.push((
          <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
      if(wc["WINCIR"]){
        result.push((
          <CharButtonCard key={`wincir-0`} caption={"조건부 승리"}>
          {wc["WINCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`win-0-${e}`} type="win" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["ROUTE"]){
        result.push((
          <CharButtonCard key={`cir-0`} caption={"루트 단어"}>
          {wc["ROUTE"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["LOSCIR"]){
        
        result.push((
          <CharButtonCard key={`loscir-0`} caption={"조건부 패배"}>
          {wc["LOSCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`los-0-${e}`} type="los" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
        
      for (let i of Object.keys(wc).filter(e => parseInt(e) <= 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
      
    }


    else if (WC.charMap[search]?.sorted === LOS) {
      const wc = WC.charMap[search].wordClass;
      
      for (let i of Object.keys(wc).sort((a,b)=>a-b)) {
        result.push((
          <CharButtonCard key={`los-${-i}`} caption={`${- i}턴 후 패배`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 단어`}>
          {WC.word_list.filter((e) => WC.charMap[search].reverseChangable.filter(e=>WC.charMap[e].sorted === LOS).includes(WC.rule.tail(e))).sort((a,b) => WC.rule.head(a).localeCompare(WC.rule.head(b))).map(
            e=>(<CharButton key={`win-${Object.keys(wc).length}-${e}`} type="win" strength={`${Math.min(Object.keys(wc).length, 3)}`} onClick={() => { setInput(WC.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
    }

      /// 루트
    else if (WC.charMap[search]?.sorted === ROUTE) {
      const wc = WC.charMap[search].wordClass;
      if(wc["ROUTE"]){
        result.push((
          <CharButtonCard key={`route-cir`} caption={`루트단어`}>
            {wc["ROUTE"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`route-cir-${e}`} type="cir" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
            {! wc["RETURN"] || wc["RETURN"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`returning-route-cir-${e}`} returning = "true" type="cir" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
          
      }
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 루트단어`}>
          {Array.from(new Set(WC.cirChars.flatMap(char=>WC.charMap[char].outCirWords.filter(e => WC.charMap[search].reverseChangable.includes(WC.rule.tail(e)))))).sort((a,b) => WC.rule.head(a).localeCompare(WC.rule.head(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(WC.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      
      if(wc["LOSCIR"]){
        result.push((
          <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
            {wc["LOSCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }


    // 승리순환
    else if (WC.charMap[search]?.sorted === WINCIR) {
      const wc =  WC.charMap[search].wordClass;
      
      if(wc["WINCIR"]){
        
              result.push((
        <CharButtonCard key={`win-cir`} caption={`조건부 승리`}>
          {wc["WINCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`win-cir-${e}`} type="win" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["ROUTE"] || wc["RETURN"]){
        
        result.push((
          <CharButtonCard key={`route-cir`} caption={`루트단어`}>
            {! wc["ROUTE"] || wc["ROUTE"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`route-cir-${e}`} type="cir" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
            {! wc["RETURN"] || wc["RETURN"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`returning-route-cir-${e}`} returning = "true" type="cir" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      
    
      // result.push((
      //   <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 루트단어`}>
      //     {Array.from(new Set(WC.cirChars.flatMap(char=>WC.charMap[char].outCirWords.filter(e => WC.charMap[search].reverseChangable.includes(WC.rule.tail(e)))))).sort((a,b) => WC.rule.head(a).localeCompare(WC.rule.head(b))).map(e =>
      //       (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(WC.rule.head(e)) }}>{`${e}`}</CharButton>)
      //     )}
      //   </CharButtonCard>))
      if(wc["LOSCIR"]){
        
        result.push((
          
          <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
            {wc["LOSCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }

    // 패배순환
    else if (WC.charMap[search]?.sorted === LOSCIR) {
      const wc =  WC.charMap[search].wordClass;

      result.push((
        <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
          {! wc["LOSCIR"] || wc["LOSCIR"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
          {! wc["RETURN"] || wc["RETURN"].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
            (<CharButton key={`returning-los-cir-${e}`} returning = "true" type="los" strength={`0`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      
      

      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => WC.rule.tail(a).localeCompare(WC.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(WC.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }

      
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 단어`}>
          {WC.word_list.filter((e) => WC.charMap[search].reverseChangable.filter(e=>WC.charMap[e].sorted = LOSCIR).includes(WC.rule.tail(e))).sort((a,b) => WC.rule.head(a).localeCompare(WC.rule.head(b))).map(
            e=>(<CharButton key={`win-${Object.keys(wc).length}-${e}`} type="win" strength='0' onClick={() => { setInput(WC.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
    }
    
    setWordCards(result)
  })

  useEffect(() => {
    if (!WC) { return; }
    applySearch();
    const winCharCards = []
    for (let i in WC.winCharClass) {
      const card = (
        <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
          {WC.winCharClass[i].sort().map(e =>
            (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i - 1 , 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      winCharCards.push(card)
    }
    winCharCards.push(
      (
        <CharButtonCard key={`win-cir`} caption={"조건부 승리"}>
            {Array.from(WC.winCirChars).sort().map(e =>
              (<CharButton key={`win-cir-${e}`} type="win" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
            )}
        </CharButtonCard>
      )
    )
    

    const losCharCards = []
    let keys = Object.keys(WC.losCharClass)
    keys.sort((a,b) =>b-a)

    for (let i of keys) {
      const card = (
        <CharButtonCard key={`los-${i}`} caption={`${-i}턴 후 패배`}>
          {WC.losCharClass[i].sort().map(e =>
            (<CharButton key={`los-${i}-${e}`} type="los" strength={`${Math.min(-i, 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      losCharCards.push(card)
    }
    losCharCards.push(
      (
        <CharButtonCard key={`los-cir`} caption={"조건부 패배"}>
            {Array.from(WC.losCirChars).sort().map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
            )}
        </CharButtonCard>
      )
    )


    const cirCharCards = []
    const card = (
      <>
          <CharButtonCard key={`max-route`} caption={"주요루트단어"}>
          {WC.maxRouteComp.sort().map(e =>
            (<CharButton key={`max-route-char-${e}`} type="cir" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
          )}
          </CharButtonCard>
          <CharButtonCard key={`rest-route`} caption={"희귀루트단어"}>
          {WC.restRouteComp.sort().map(e =>
            (<CharButton key={`rest-route-char-${e}`} type="cir" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
          )}
          </CharButtonCard>
      </>
      
    )
    cirCharCards.push(card)
    setCharCards([winCharCards, losCharCards, cirCharCards][radioValue])
  }, [radioValue, WC])

  useEffect(() => {
    setSearch(input)
    scrollToTop()
  }, [input])

  useEffect(applySearch, [search])





  return (
    <div style = {{display: display ? "block" : "none"}}>
      <Search

        input={input}
        setInput={setInput}
      />

      <WordBox>
        {wordCards}
      </WordBox>


      <span className="selection-btn" onClick={() => setOffCanvasShow(!offCanvasShow)}>
        <img className="btn-icon" src="icon/apps_FILL0_wght200_GRAD0_opsz24.svg"></img>
      </span>
      <CharOffcanvas
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        show={offCanvasShow}
        onHide={() => { setOffCanvasShow(!offCanvasShow) }}
      >
        {charCards}
      </CharOffcanvas>
    </div>
  )
}

export default SearchMode