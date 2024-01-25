import { useState, useEffect, useCallback, useRef } from 'react'
import { Rule ,WCengine, LOS, WIN, LOSCIR, WINCIR, ROUTE} from "./js/WordChain"
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
import SwitchMode from './component/SwitchMode'
import WordInput from './component/WordInput'
import './App.css'
import ChatBox from './component/ChatBox'
import Chat from './component/Chat'
import Button from 'react-bootstrap/Button'

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 스무스한 애니메이션으로 스크롤 이동
  });
};

const checkKorean = (char) => {
        
  let isThereLastChar = (char.charCodeAt(0) - 44032) % 28
  if (isThereLastChar) {
    return '으로'
  }
  return '로'
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [offCanvasShow, setOffCanvasShow] = useState(false);
  const [charCards, setCharCards] = useState([]);
  const [radioValue, setRadioValue] = useState('0');
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [wordCards, setWordCards] = useState([]);
  const [wm, setWm] = useState(null);
  const [mode, setMode] = useState('0')
  const [rule, setRule] = useState({
    dict: 0,
    pos: [0],
    cate: [0, 1, 2, 3],
    len: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1,
    manner: false
  });
  const [chatList, setChatList] = useState([])
  const [practiceWm, setPracticeWm] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [wmSign, setWmSign] = useState(null)
  const [initiatePracticeWm, setInitiatePracticeWm] = useState(null)
  const [practiceInput, setPracticeInput] = useState("")
  const [sendSign, setSendSign] = useState(false)
  const [history, setHistory] = useState([])
  const [regame, setRegame] = useState(false)
  const chatBox = useRef()
  const [gameEnd, setGameEnd] = useState(false)

  const applySearch = useCallback(() => {
    if (!wm) { return; }
    const result = []
    if (wm.charMap[search]?.sorted === WIN) {
      const wc = wm.charMap[search].wordClass;
      for (let i of Object.keys(wc).filter(e => parseInt(e) >= 0)) {
        result.push((
          <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
      if(wc["WINCIR"]){
        result.push((
          <CharButtonCard key={`wincir-0`} caption={"조건부 승리"}>
          {wc["WINCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`win-0-${e}`} type="win" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["ROUTE"]){
        result.push((
          <CharButtonCard key={`cir-0`} caption={"루트 단어"}>
          {wc["ROUTE"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["LOSCIR"]){
        
        result.push((
          <CharButtonCard key={`loscir-0`} caption={"조건부 패배"}>
          {wc["LOSCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`los-0-${e}`} type="los" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
        
      for (let i of Object.keys(wc).filter(e => parseInt(e) <= 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }


    else if (wm.charMap[search]?.sorted === LOS) {
      const wc = wm.charMap[search].wordClass;
      
      for (let i of Object.keys(wc).sort((a,b)=>a-b)) {
        result.push((
          <CharButtonCard key={`los-${-i}`} caption={`${- i}턴 후 패배`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 단어`}>
          {wm.word_list.filter((e) => wm.charMap[search].reverseChangable.filter(e=>wm.charMap[e].sorted === LOS).includes(wm.rule.tail(e))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(
            e=>(<CharButton key={`win-${Object.keys(wc).length}-${e}`} type="win" strength={`${Math.min(Object.keys(wc).length, 3)}`} onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
    }

      /// 루트
    else if (wm.charMap[search]?.sorted === ROUTE) {
      const wc = wm.charMap[search].wordClass;
      if(wc["ROUTE"]){
        result.push((
          <CharButtonCard key={`route-cir`} caption={`루트단어`}>
            {wc["ROUTE"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`route-cir-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
            {! wc["RETURN"] || wc["RETURN"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`returning-route-cir-${e}`} returning = "true" type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
          
      }
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 루트단어`}>
          {Array.from(new Set(wm.cirChars.flatMap(char=>wm.charMap[char].outCirWords.filter(e => wm.charMap[search].reverseChangable.includes(wm.rule.tail(e)))))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(e =>
            (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      
      if(wc["LOSCIR"]){
        result.push((
          <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
            {wc["LOSCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }










    // 승리순환
    else if (wm.charMap[search]?.sorted === WINCIR) {
      const wc =  wm.charMap[search].wordClass;
      
      if(wc["WINCIR"]){
        
              result.push((
        <CharButtonCard key={`win-cir`} caption={`조건부 승리`}>
          {wc["WINCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`win-cir-${e}`} type="win" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
      if(wc["ROUTE"] || wc["RETURN"]){
        
        result.push((
          <CharButtonCard key={`route-cir`} caption={`루트단어`}>
            {! wc["ROUTE"] || wc["ROUTE"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`route-cir-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
            {! wc["RETURN"] || wc["RETURN"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`returning-route-cir-${e}`} returning = "true" type="cir" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      
    
      // result.push((
      //   <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 루트단어`}>
      //     {Array.from(new Set(wm.cirChars.flatMap(char=>wm.charMap[char].outCirWords.filter(e => wm.charMap[search].reverseChangable.includes(wm.rule.tail(e)))))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(e =>
      //       (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`} onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
      //     )}
      //   </CharButtonCard>))
      if(wc["LOSCIR"]){
        
        result.push((
          
          <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
            {wc["LOSCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}
          </CharButtonCard>))
      }
      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }
    }










    // 패배순환
    

    else if (wm.charMap[search]?.sorted === LOSCIR) {
      const wc =  wm.charMap[search].wordClass;

      result.push((
        <CharButtonCard key={`los-cir`} caption={`조건부 패배`}>
          {! wc["LOSCIR"] || wc["LOSCIR"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`los-cir-${e}`} type="los" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
          {! wc["RETURN"] || wc["RETURN"].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
            (<CharButton key={`returning-los-cir-${e}`} returning = "true" type="los" strength={`0`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      
      

      for (let i of Object.keys(wc).filter(e => parseInt(e) < 0).sort((a,b)=>{return a-b})) {
        result.push((
          <CharButtonCard key={`los-${-i-1}`} caption={`${-i}턴 후 패배`}>
            {wc[i].sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).map(e =>
              (<CharButton key={`los-${-i-1}-${e}`} type="los" strength={`${Math.min(-i-1, 3)}`} onClick={() => { setInput(wm.rule.tail(e)) }}>{`${e}`}</CharButton>)
            )}

          </CharButtonCard>))
      }

      
      result.push((
        <CharButtonCard key={`endwith`} caption={`${search}(으)로 끝나는 단어`}>
          {wm.word_list.filter((e) => wm.charMap[search].reverseChangable.filter(e=>wm.charMap[e].sorted = LOSCIR).includes(wm.rule.tail(e))).sort((a,b) => wm.rule.head(a).localeCompare(wm.rule.head(b))).map(
            e=>(<CharButton key={`win-${Object.keys(wc).length}-${e}`} type="win" strength='0' onClick={() => { setInput(wm.rule.head(e)) }}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
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
    for (let i in wm.winCharClass) {
      const card = (
        <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
          {wm.winCharClass[i].sort().map(e =>
            (<CharButton key={`win-${i}-${e}`} type="win" strength={`${Math.min(i - 1 , 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      winCharCards.push(card)
    }
    winCharCards.push(
      (
        <CharButtonCard key={`win-cir`} caption={"조건부 승리"}>
            {Array.from(wm.winCirChars).sort().map(e =>
              (<CharButton key={`win-cir-${e}`} type="win" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
            )}
        </CharButtonCard>
      )
    )
    

    const losCharCards = []
    let keys = Object.keys(wm.losCharClass)
    keys.sort((a,b) =>b-a)

    for (let i of keys) {
      const card = (
        <CharButtonCard key={`los-${i}`} caption={`${-i}턴 후 패배`}>
          {wm.losCharClass[i].sort().map(e =>
            (<CharButton key={`los-${i}-${e}`} type="los" strength={`${Math.min(-i, 3)}`} onClick={() => { setInput(e) }}>{`${e}`}</CharButton>)
          )}

        </CharButtonCard>
      )
      losCharCards.push(card)
    }
    losCharCards.push(
      (
        <CharButtonCard key={`los-cir`} caption={"조건부 패배"}>
            {Array.from(wm.losCirChars).sort().map(e =>
              (<CharButton key={`los-cir-${e}`} type="los" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
            )}
        </CharButtonCard>
      )
    )


    const cirCharCards = []
    const card = (
      <>
          <CharButtonCard key={`max-route`} caption={"주요루트단어"}>
          {wm.maxRouteComp.sort().map(e =>
            (<CharButton key={`max-route-char-${e}`} type="cir" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
          )}
          </CharButtonCard>
          <CharButtonCard key={`rest-route`} caption={"희귀루트단어"}>
          {wm.restRouteComp.sort().map(e =>
            (<CharButton key={`rest-route-char-${e}`} type="cir" strength={`${0}`} onClick={() => { setInput(e); }}>{`${e}`}</CharButton>)
          )}
          </CharButtonCard>
      </>
      
    )
    cirCharCards.push(card)
    setCharCards([winCharCards, losCharCards, cirCharCards][radioValue])
  }, [wm, radioValue])

  useEffect(() => {
    setSearch(input)
    scrollToTop()
  }, [wm, input])

  useEffect(applySearch, [search])

  useEffect(()=>{
    setDifficulty(null)
    if (mode == "1"){
      setChatList(
        [(<Chat sender="computer">
        끄글 연습 모드에 오신 것을 환영합니다.
        <br></br>
        난이도를 선택해주세요.
        <div className='diff-box'>
          <Button onClick = {()=>{setDifficulty("0"); setRegame(true)}} variant="outline-primary" className = "diff-btn" >쉬움</Button>
          {/* <Button onClick = {()=>setDifficulty("1")} variant="outline-success" className = "diff-btn">보통</Button> */}
          <Button onClick = {()=>{setDifficulty("2"); setRegame(true)}} variant="outline-danger" className = "diff-btn">어려움</Button>
        </div>
      </Chat>)]
      )
    }
    setPracticeWm(null)
    
    
  }, [mode, wm])



  useEffect(()=>{
    if(!regame){return}
    setRegame(false)
    if(!wm){return}
    if(!difficulty){return}
    setChatList([...chatList.slice(0, 1), <Chat sender = "computer" loading></Chat>])
    setHistory([])
    setPracticeWm(null)
    setGameEnd(false)
    setInitiatePracticeWm(true)
    
    
  }, [difficulty,regame])


  useEffect(()=>{
    
    if(practiceWm && initiatePracticeWm){
      setInitiatePracticeWm(false)
      
      setChatList([...chatList.slice(0, 1), (<Chat sender="computer">
      난이도 <b>{`${difficulty === "0" ? "쉬움" : (difficulty === "1" ? "보통" : "어려움")}`}</b>을 선택하셨습니다.
      <br></br>
      먼저 단어를 제시해주세요!
    </Chat>)])
      return
    }
    
    if (practiceWm){
      
      let currChar = practiceWm.rule.tail(practiceInput)
      let next = practiceWm.charMap[currChar].outWords
      let word;
      if(next.length === 0){
        setChatList([...chatList.slice(0,chatList.length - 1), 
          <Chat sender="computer">{`당신이 이겼습니다.`}</Chat>])
          setGameEnd(true)
        console.log(history)
        return
      }
      if(difficulty === "0"){
        word = next[Math.floor(Math.random() * next.length)]
      }
      else{
        if(difficulty === "1"){

          return
        }
        else if(difficulty === "2"){
          let winWord = practiceWm.winWord(currChar, 1, true)
          if(typeof winWord === 'string'){
            word = winWord
            
            console.log("승 : " +  word)
          } 
          else if(practiceWm.charMap[currChar].sorted === LOS){
            let wc = practiceWm.charMap[currChar].wordClass
            let key = Math.max(...Object.keys(wc))
            let next = wc[key]
            word = next[Math.floor(Math.random() * next.length)]
          }
          else if(practiceWm.charMap[currChar].sorted === LOSCIR){
            console.log("패")
            if(practiceWm.charMap[currChar].wordClass["RETURN"]){
              let next = practiceWm.charMap[currChar].wordClass["RETURN"]
              word = next[Math.floor(Math.random() * next.length)]
            }else{
              let next = practiceWm.charMap[currChar].wordClass["LOSCIR"]
              
              word = next[Math.floor(Math.random() * next.length)]
            } 
          }
          else{
            let losWords = winWord;
            console.log("죽는단어 : " + losWords)
            let losNextChars = losWords.map(e=>practiceWm.rule.tail(e))
            let next = practiceWm.charMap[currChar].wordClass["ROUTE"].filter(e=>!losNextChars.includes(practiceWm.rule.tail(e)))
            
            if(next.length === 0){
              console.log("1수 패")
              word = losWords[Math.floor(Math.random() * losWords.length)]  
            }
            else{
              word = next[Math.floor(Math.random() * next.length)]
            }
            
            
          }
          

      
        }
        
      }
      setChatList([...chatList.slice(0,chatList.length - 1), 
        <Chat sender="computer">{word}</Chat>])
        
        
      setHistory([...history, word])
      
      if (word === undefined){
        alert("[" + history + "] \n에러가 발생했습니다. https://open.kakao.com/me/singrum")
      }
      next = practiceWm.charMap[practiceWm.rule.tail(word)].outWords.filter(e=>e != word)
      if(next.length === 0){
        setChatList([...chatList.slice(0,chatList.length - 1),
          <Chat sender="computer">{word}</Chat>,
          <Chat sender="computer">{`제가 이겼습니다.`}</Chat>])
        setGameEnd(true)
        return
      }
      
    }


  }, [practiceWm])
  useEffect(()=>{
    if(!initiatePracticeWm){return}
    
    setPracticeWm(wm.copy())
    
    
    
  }, [initiatePracticeWm])  
  
  useEffect(()=>{
    if(!wmSign){return}
    setWmSign(false)

    setPracticeWm(practiceWm.copy(history))

  },[wmSign])

  useEffect(()=>{
    if (!sendSign){return;}
    setSendSign(false)

    if(gameEnd){
      setChatList([...chatList, 
        <Chat sender = "you">{practiceInput}</Chat>])
      return
    }
    if (difficulty === null){
      setChatList([...chatList, 
        <Chat sender = "you">{practiceInput}</Chat>,
        <Chat sender="computer">먼저 난이도를 선택해주세요.</Chat>])
      return
    }
    
    if (history.length > 0){
      let chan = practiceWm.rule.changable(practiceWm.rule.tail(history[history.length - 1]))
      if (!chan.includes(practiceWm.rule.head(practiceInput))){
        setChatList([...chatList, 
          <Chat sender = "you">{practiceInput}</Chat>,
          <Chat sender="computer"><b>{`${chan.join(" 또는 ")}`}</b>{checkKorean(chan[0])} 시작하는 단어를 입력해주세요.</Chat>])
        return
      }
      if (history.includes(practiceInput)){
        setChatList([...chatList, 
          <Chat sender = "you">{practiceInput}</Chat>,
          <Chat sender="computer">{`이미 사용한 단어입니다.`}</Chat>])
        return
      }
    }
    if (!practiceWm.word_list.includes(practiceInput)){
      setChatList([...chatList, 
        <Chat sender = "you">{practiceInput}</Chat>,
        <Chat sender="computer">존재하지 않는 단어입니다.</Chat>])
      return
    }
    setHistory([...history, practiceInput])
    setChatList([...chatList,<Chat sender = "you">{practiceInput}</Chat>,
    <Chat sender = "computer" loading></Chat>
    ])
    





    setWmSign(true)
  }, [sendSign])

  // 스크롤 다운
  useEffect(()=>{
    if(chatBox.current){
      chatBox.current.scrollTop = chatBox.current.scrollHeight
    }
  }, [chatList])
  

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

      <SwitchMode
        mode = {mode}
        setMode = {setMode}
      ></SwitchMode>
      <div style = {{display: mode ==="0" ? "block" : "none"}}>
        <Search

          input={input}
          setInput={setInput}
        />

        <WordBox>
          {wordCards}
        </WordBox>


        <span className="selection-btn" onClick={()=>setOffCanvasShow(!offCanvasShow)}>
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
      <div style = {{display: mode ==="1" ? "block" : "none"}}>
        <ChatBox
          
          chatList = {chatList}
          setChatLists = {setChatList}
          ref = {chatBox}
        >
          {chatList}
        </ChatBox>
        <WordInput
          history = {history}
          practiceInput = {practiceInput}
          setPracticeInput = {setPracticeInput}
          sendSign = {sendSign}
          setSendSign = {setSendSign}
        >
          
        </WordInput>
      </div>
      


    </>
  )
}

export default App
