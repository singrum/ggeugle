import { useState, useEffect } from 'react'
import Header from './component/Header'
import Search from './component/Search'
import WordBox from './component/WordBox'
import Loading from './component/Loading'
import CharOffcanvas from './component/CharOffcanvas'
import CharButtonCard from './component/CharButtonCard'
import CharButton from './component/CharButton'
import { getData } from './js/ruleUpdate'

import './App.css'



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [offCanvasShow, setOffCanvasShow] = useState(false);
  const [charCards, setCharCards] = useState([]);
  useEffect(() => {
    async function applyData() {
      const wm = await getData();
      setIsLoading(false);
      
      const result = []
      for(let i in wm.win_char_class.content){
        
        const card =(
          <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
            {Array.from(wm.win_char_class.get(i)).map(e=>
              (<CharButton key={`win-${i}-${e}`} type="win" strength={`${i}`}>{`${e}`}</CharButton>)
            )}
            
          </CharButtonCard>
        )
        result.push(card)
      }
      setCharCards(result)
      
    }
    applyData()

  }, []);

  return (
    <>
      <Loading style={{ display: isLoading ? "flex" : "none" }} />
      <Header />
      <Search setOffCanvasShow={setOffCanvasShow} offCanvasShow={offCanvasShow} />
      <WordBox></WordBox>
      <CharOffcanvas
        show={offCanvasShow}
        onHide={() => { setOffCanvasShow(!offCanvasShow) }}
        placement="bottom" backdrop={false}
      >
        {charCards}
      </CharOffcanvas>


    </>
  )
}

export default App
