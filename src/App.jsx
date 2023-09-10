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
  const [radioValue, setRadioValue] = useState('0');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [wordCards, setWordCards] = useState([]);
  const [wm, setWm] = useState()
  
  useEffect(() => {
    async function applyData() {
      const wm = await getData();
      setWm(wm)
      
      const winCharCards = []
      for(let i in wm.win_char_class.content){
        
        const card =(
          <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
            {Array.from(wm.win_char_class.get(i)).map(e=>
              (<CharButton key={`win-${i}-${e}`} type="win" strength={`${i}`}>{`${e}`}</CharButton>)
            )}
            
          </CharButtonCard>
        )
        winCharCards.push(card)
      }
      const losCharCards = []
      for(let i in wm.los_char_class.content){
        
        const card =(
          <CharButtonCard key={`los-${i}`} caption={`${i}턴 후 패배`}>
            {Array.from(wm.los_char_class.get(i)).map(e=>
              (<CharButton key={`los-${i}-${e}`} type="los" strength={`${i}`}>{`${e}`}</CharButton>)
            )}
            
          </CharButtonCard>
        )
        losCharCards.push(card)
      }
      setData([winCharCards, losCharCards])
      
      const cirCharCards = []
      const card = (
        <CharButtonCard key={`cir`} caption={false}>
          {Array.from(wm.cir_char_set).map(e=>
            (<CharButton key={`cir-${e}`} type="cir" strength={`${0}`}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>
      )
      cirCharCards.push(card)
      setData([winCharCards, losCharCards, cirCharCards])
      setCharCards(winCharCards)
      
      setIsLoading(false);
    }
    applyData()

  }, []);
  
  useEffect(()=>{
    setCharCards(data[radioValue])
  },[radioValue])
  
  useEffect(()=>{
    if(!wm){
      return
    }
    const result = []
    if(wm.win_char_set.has(search)){
      for(let i in wm.win_word_class.get(search).content){
        result.push((
        <CharButtonCard key={`win-${i}`} caption={`${i}턴 후 승리`}>
          {Array.from(wm.win_word_class.get(search).get(i)).map(e=>
            (<CharButton key={`win-${i}-${e}`} type="win" strength={`${i}`}>{`${e}`}</CharButton>)
          )}
          
        </CharButtonCard>))
      }
    }
    else if(wm.los_char_set.has(search)){
      for(let i in wm.los_word_class.get(search).content){
        result.push((
        <CharButtonCard key={`los-${i}`} caption={`${i}턴 후 승리`}>
          {Array.from(wm.los_word_class.get(search).get(i)).map(e=>
            (<CharButton key={`los-${i}-${e}`} type="los" strength={`${i}`}>{`${e}`}</CharButton>)
          )}
        </CharButtonCard>))
      }
    }
    else if(wm.cir_char_set.has(search)){
      result.push((
      <CharButtonCard key={`cir-0`} caption={false}>
        {wm.nextCirWordList(search).map(e=>
          (<CharButton key={`cir-0-${e}`} type="cir" strength={`0`}>{`${e}`}</CharButton>)
        )}
      </CharButtonCard>))
      
    }
    
    setWordCards(result)
  }, [search])


  return (
    <>
      <Loading style={{ display: isLoading ? "flex" : "none" }} />
      
      <Header />

      <Search 
        setOffCanvasShow={setOffCanvasShow} 
        offCanvasShow={offCanvasShow} 
        search = {search}
        setSearch = {setSearch}
      />

      <WordBox>
        {wordCards}
      </WordBox>

      <CharOffcanvas
        radioValue = {radioValue}
        setRadioValue = {setRadioValue}
        show={offCanvasShow}
        onHide={() => { setOffCanvasShow(!offCanvasShow) }}
      >
        {charCards}
      </CharOffcanvas>


    </>
  )
}

export default App
