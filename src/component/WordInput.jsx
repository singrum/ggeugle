import { useState, useEffect} from 'react'


function WordInput(props) {
  const [sendable, setSendable] = useState(false)
  const [input, setInput] = useState("")
  useEffect(()=>{
    setSendable(input.length > 0)
  }, [input])
  return (
    <>
      <div className="word-input-box">
        <input
          className="word-input"
          type="search"
          id="word-input-box"
          placeholder=""
          value = {input || ''}
          onChange={e=>{
            setInput(e.target.value)
          }}
          onKeyDown={e=> {
            if(e.code === "Enter"){
              if (e.nativeEvent.isComposing) {
                return ;
              }
              if(input.length > 0){
                props.setSendSign(true)
                props.setPracticeInput(input)
                setInput("");
              }
          }}}
          
        />
        <div 
          className="send-btn" 
          onClick = {()=>{
            if(input.length > 0){
              props.setSendSign(true)
              props.setPracticeInput(input)
              setInput("");
            }
          }}

        >
          <img style = {{opacity: sendable ? 1 : 0.5}} className="send-btn-icon" src="icon/send_FILL0_wght200_GRAD0_opsz24.svg" />
        </div>
      </div>




    </>
  )
}

export default WordInput