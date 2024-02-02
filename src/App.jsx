import { useState} from 'react'
import { WCcontext } from './context/WCcontext'
import ModeSwitch from './component/container/ModeSwitch'
import './App.css'
import Header from './component/container/Header'
import SearchMode from './component/container/SearchMode'
import PracticeMode from './component/container/PracticeMode'
import StatMode from './component/container/StatMode'
import AnalysisMode from './component/container/AnalysisMode'





function App() {
  const [WC, setWC] = useState()
  const [mode, setMode] = useState('0')
  return (
    <WCcontext.Provider value = {{WC, setWC}}>
      <Header/>
      <ModeSwitch mode = {mode} setmode = {setMode}></ModeSwitch>
      <SearchMode display = {mode === "0"}/>
      <PracticeMode display = {mode === "1"}/>
      <AnalysisMode display = {mode === "2"}/>
      <StatMode display = {mode === "3"}/>
    </WCcontext.Provider>
  )
}

export default App
