import { WCcontext } from "../../context/WCcontext";
import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { Rule, WCengine, Turn, LOS, WIN, LOSCIR, WINCIR, ROUTE } from "../../js/WordChain"
import ChatBox from "./ChatBox";
import WordInput from "./WordInput";
import Chat from "../presentation/Chat";
import { Button } from "react-bootstrap";

// const WCWorker = new Worker("worker.js")

const checkKorean = (char) => {

  let isThereLastChar = (char.charCodeAt(0) - 44032) % 28
  if (isThereLastChar) {
    return '으로'
  }
  return '로'
}


function PracticeMode({ display }) {
  const [isLoading, setIsLoading] = useState(false);
  const difficulty = useRef(undefined)
  const history = useRef([])
  const WCworker = useRef([])

  const [chatList, setChatList] = useState([])

  const chatBox = useRef()
  const neglectChat = useRef(false)

  const { WC, setWC } = useContext(WCcontext)

  const initPractice = useCallback((clear) => {

    let initChat = clear ? (<Chat sender="computer">
      끄글 연습 모드에 오신 것을 환영합니다.
      <br />
      <b>/도움말</b>을 입력하면 명령어를 보실 수 있습니다.
      <br />
      <br />
      게임을 시작하려면 난이도를 선택해주세요.
      <div className='diff-box'>
        <Button onClick={() => { difficulty.current = 0; startGame() }} variant="outline-primary" className="diff-btn">쉬움</Button>
        <Button onClick={() => { difficulty.current = 1; startGame() }} variant="outline-success" className="diff-btn">보통</Button>
        <Button onClick={() => { difficulty.current = 2; startGame() }} variant="outline-danger" className="diff-btn">어려움</Button>
      </div>
    </Chat>)
      : (<Chat sender="computer">
        게임을 시작하려면 난이도를 선택해주세요.
        <div className='diff-box'>
          <Button onClick={() => { difficulty.current = 0; startGame() }} variant="outline-primary" className="diff-btn">쉬움</Button>
          <Button onClick={() => { difficulty.current = 1; startGame() }} variant="outline-success" className="diff-btn">보통</Button>
          <Button onClick={() => { difficulty.current = 2; startGame() }} variant="outline-danger" className="diff-btn">어려움</Button>
        </div>
      </Chat>)

    setChatList(curr => [...(clear ? [] : curr), initChat]
    )

    difficulty.current = undefined

  })

  async function startGame() {
    setIsLoading(true)
    neglectChat.current = false
    // console.log("로딩 시작")


    setIsLoading(false);
    setChatList(curr => [
      ...curr.slice(0, curr.length),
      <Chat sender="computer">
        난이도 <b>{`${difficulty.current === 0 ? "쉬움" : difficulty.current === 1 ? "보통" : "어려움"}`}</b>을 선택하셨습니다.
        <br></br>
        먼저 단어를 제시해주세요!
      </Chat>
    ])
    history.current = []
  }

  function onSend(input) {
    setChatList(curr => [...curr, <Chat sender="you">{input}</Chat>])
    if (isLoading) { return }
    if (input === "/도움말") {
      setChatList(curr => [...curr, <Chat sender="computer">
        <b>/도움말</b> : 사용가능한 명령어 목록을 보여줍니다.<br />
        <b>/다시시작</b> : 게임을 다시 시작합니다.<br />
        <b>/복사</b> : 현재까지의 기보를 클립보드에 복사합니다.<br />
        <b>/초기화</b> : 채팅창을 초기화합니다.<br />
        {/* <b>/검색</b> : 현재 당신에게 주어진 글자를 검색합니다.<br/>
        <b>/분석</b> : 현재 당신의 포지션을 분석합니다. */}
      </Chat>])
      return
    }
    if (input === "/초기화") {
      initPractice(true)
      return
    }
    if (input === "/다시시작") {
      initPractice(false)
      return
    }
    if (input === "/복사") {
      setChatList(curr => [...curr, <Chat sender="computer">
        현재까지의 기보가 클립보드에 복사되었습니다!
      </Chat>])
      if (history.current.length > 0) {
        let text = "나 vs 끄글\n"
        for (let i = 0; i < history.current.length / 2; i++) {
          text += "\n"
          text += history.current[i * 2]
          text += " "
          if (history.current[i * 2 + 1]) {
            text += history.current[i * 2 + 1]
          }
        }
        navigator.clipboard.writeText(text)
      }
      return
    }

    if (neglectChat.current) { return }
    if (difficulty.current === undefined) {
      setChatList(curr => [...curr, <Chat sender="computer">먼저 난이도를 선택해주세요.</Chat>])
      return
    }

    if (history.current.length > 0) {

      let chan = WC.rule.changable(WC.rule.tail(history.current[history.current.length - 1]))
      if (!chan.includes(WC.rule.head(input))) {
        setChatList(curr => [...curr, <Chat sender="computer"><b>{`${chan.join(" 또는 ")}`}</b>{checkKorean(chan[0])} 시작하는 단어를 입력해주세요.</Chat>])
        return
      }
      if (history.current.includes(input)) {
        setChatList(curr => [...curr, <Chat sender="computer">이미 사용한 단어입니다.</Chat>])
        return
      }
    }
    if (!WC.word_list.includes(input)) {
      setChatList(curr => [...curr, <Chat sender="computer">존재하지 않는 단어입니다.</Chat>])
      return
    }


    // 입력값이 유효한 단어인 경우

    let currChar = WC.rule.tail(input)
    history.current = [...history.current, input]
    let next = WC.charMap[currChar].outWords.filter(e => !history.current.includes(e))


    if (next.length === 0) {
      setChatList(curr => [...curr, <Chat sender="computer">당신이 이겼습니다.<br /><b>/다시시작</b>을 입력하면 게임을 다시 시작할 수 있습니다.</Chat>
      ])
      neglectChat.current = true
      return
    }


    // 쉬움
    if (difficulty.current == 0) {
      const word = next[Math.floor(Math.random() * next.length)]
      setChatList(curr => [...curr, <Chat sender="computer">{word}</Chat>])
      history.current = [...history.current, word]
      return
    }
    



    setIsLoading(true)
    getWordNonhuristicCase(input)

  }

  const getWordNonhuristicCase = input => {
    WCworker.current = new Worker(new URL('../../worker/worker.js', import.meta.url), {
      type: 'module'
    });

    const data = {
      rule: WC.rule.getRuleObj(),
      word_list: WC.word_list.filter(e => !history.current.includes(e)),
      currChar: WC.rule.tail(input),
      action: (difficulty.current === 1) ? "getWinWordMidium" : "getWinWordHard"
    }
    
    
    WCworker.current.postMessage(data)
    WCworker.current.onmessage = ({ data }) => {
      WCworker.current.terminate()
      setIsLoading(false)
      setChatList(curr => [...curr, <Chat sender="computer">{data.word}</Chat>])
      history.current = [...history.current, data.word]
      const next = WC.charMap[WC.rule.tail(data.word)].outWords.filter(e => !history.current.includes(e))
      if (next.length === 0) {
        setChatList(curr => [...curr,
        <Chat sender="computer">제가 이겼습니다.<br /><b>/다시시작</b>을 입력하면 게임을 다시 시작할 수 있습니다.</Chat>])
        neglectChat.current = true
      }
    }
  }

  useEffect(() => { initPractice(true) }, [WC])

  // 스크롤 다운
  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight
    }

  }, [chatList])
  

  return (
    <div style={{ display: display ? "block" : "none" }}>
      <ChatBox
        chatList={chatList}
        setChatLists={setChatList}
        ref={chatBox}
      >
        {chatList}
        {isLoading && (<Chat sender="computer" loading />)}
      </ChatBox>
      <WordInput
        onSend={onSend}
      >

      </WordInput>

    </div>
  )
}

export default PracticeMode