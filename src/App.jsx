import { useState } from 'react'
import Header from './component/Header'
import Search from './component/Search'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Search></Search>
      {/* <WordBox></WordBox>
      <CharBox></CharBox> */}
      
    </>
  )
}

export default App
