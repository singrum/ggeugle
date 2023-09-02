import { useState } from 'react'
import Header from './header'
import Search from './search'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Search></Search>
      
    </>
  )
}

export default App
