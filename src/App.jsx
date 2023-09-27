import { useState, useEffect, useCallback, useRef } from 'react'

import Search from './component/Search'
import WordBox from './component/WordBox'
import Loading from './component/Loading'
import CharOffcanvas from './component/CharOffcanvas'
import CharButtonCard from './component/CharButtonCard'
import CharButton from './component/CharButton'
import { getData } from './js/ruleUpdate'
import RuleModal from './component/RuleModal'
import MenuBtn from './component/MenuBtn'
import StatModal from './component/StatModal'
import './App.css'



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [offCanvasShow, setOffCanvasShow] = useState(false);
  const [charCards, setCharCards] = useState([]);
  const [radioValue, setRadioValue] = useState('0');
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [wordCards, setWordCards] = useState([]);
  const [wm, setWm] = useState(null);

  const [rule, setRule] = useState({
    dict: 0,
    pos: [0],
    cate: [0, 1, 2, 3],
    len: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1
  });

  const applySearch = useCallback(() => {
    if (!wm) { return; }
    const result = []
    if (wm.win_char_set.has(search)) {
      const wc = wm.win_word_class.get(search).content;
      for (let i of Object.keys(wc).filter(e => parseInt(e) >= 0)) {
        result.push((
          <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
            {Array.from(wc[i]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
      if(wc["cir"]){
        result.push((
          <CharButtonCard key={`cir-0`} caption={"순환단어"}>
          {Array.from(wc["cir"]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
        
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {Array.from(wc[i]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }

    }
    else if (wm.los_char_set.has(search)) {
      const wc = wm.los_word_class.get(search).content;
      for (let i of Object.keys(wc).sort((a,b)=>{return b-a})) {
        result.push((
          <CharButtonCard key={`los-${i}`} caption={`${+i + 1}턴 후 패배`}>
            {Array.from(wc[i]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${i}-${e}`} type="los" strength={`${Math.min(i, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 단어`}>
          {wm.rule.word_list.filter((e) => wm.rule.reverse_changable(search).filter(e=>wm.los_char_set.has(e)).includes(wm.rule.tail(e))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(
            e=>(<CharButton key={`win-${Object.keys(wc).length}-${e}`} type="win" strength={`${Math.min(Object.keys(wc).length, 3)}`} onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
    }
    else if (wm.cir_char_set.has(search)) {
      const wc = wm.cir_word_class.get(search).content;
      result.push((
        <CharButtonCard key={`cir-0`} caption={`순환단어`}>
          {Array.from(wc["cir"]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))

      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 순환단어`}>
          {Array.from(new Set(Array.from(wm.cir_char_set).flatMap(char=>wm.nextCirWordList(char).filter(e => wm.rule.reverse_changable(search).includes(wm.rule.tail(e)))))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {Array.from(wc[i]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }

    setWordCards(result)
  })

  useEffect(() => {
    async function applyData() {
      const wm1 = await getData(rule);
      setWm(wm1);
      setIsLoading(false);

    }
    applyData();

  }, [rule]);

  useEffect(() => {
    if (!wm) { return; }
    applySearch();
    const winCharCards = []
    for (let i in wm.win_char_class.content) {

      const card = (
        <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
          {Array.from(wm.win_char_class.get(i)).sort().map(e =>
            (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i, 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      winCharCards.push(card)
    }
    const losCharCards = []
    for (let i in wm.los_char_class.content) {

      const card = (
        <CharButtonCard key={`los-${i}`} caption={`${i}턴 후 패배`}>
          {Array.from(wm.los_char_class.get(i)).sort().map(e =>
            (<CharButton key={`los-${i}-${e}`} type="los" strength={`${Math.min(i, 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      losCharCards.push(card)
    }

    const cirCharCards = []
    const card = (
      <CharButtonCard key={`cir`} caption={false}>
        {Array.from(wm.cir_char_set).sort().map(e =>
          (<CharButton key={`cir-${e}`} type="cir" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
        )}
      </CharButtonCard>
    )
    cirCharCards.push(card)
    setCharCards([winCharCards, losCharCards, cirCharCards][radioValue])
  }, [wm, radioValue])

  useEffect(() => {
    setSearch(input)
  }, [wm, input])

  useEffect(applySearch, [search])

  const [ruleModalShow, setRuleModalShow] = useState(false);
  const [statModalShow, setStatModalShow] = useState(false);

  return (
    <>
      <Loading style={{ display: isLoading ? "flex" : "none" }} />

      <div className='header'>
        <span className="logo-set" onClick={()=>window.location.reload()}>
          <img className="logo-img" src="img/ggeugle_logo_small.png"></img>
          <span className='logo-text'>끄글</span>
        </span>

        <span className="menu-set">
          {/* <MenuBtn name="chatbot" caption="챗봇" iconSrc= "icon/forum_FILL0_wght200_GRAD0_opsz24.svg"/> */}
          <MenuBtn name="stat" caption="통계" iconSrc="icon/query_stats_FILL0_wght200_GRAD0_opsz24.svg" onClick={() => setStatModalShow(true)} />
          <MenuBtn name="setting" caption="룰 설정" iconSrc="icon/tune_FILL0_wght200_GRAD0_opsz24.svg" onClick={() => setRuleModalShow(true)} />

        </span>
      </div>

      <StatModal
        wm={wm}
        modalShow={statModalShow}
        setModalShow={setStatModalShow}
      />

      <RuleModal
        wm={wm}
        rule={rule}
        setRule={setRule}
        setIsLoading={setIsLoading}
        modalShow={ruleModalShow}
        setModalShow={setRuleModalShow}
      />



      <Search
        setOffCanvasShow={setOffCanvasShow}
        offCanvasShow={offCanvasShow}
        input={input}
        setInput={setInput}
      />

      <WordBox>
        {wordCards}
      </WordBox>

      <CharOffcanvas
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        show={offCanvasShow}
        onHide={() => { setOffCanvasShow(!offCanvasShow) }}
      >
        {charCards}
      </CharOffcanvas>


    </>
  )
}

export default App
