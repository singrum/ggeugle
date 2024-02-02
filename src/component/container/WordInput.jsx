import { useState, useEffect} from 'react'


function WordInput({onSend}) {
  const [input, setInput] = useState("")
  
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
                onSend(input)
                setInput("");
              }
          }}}
          
        />
        <div 
          className="input-btn-box" 
          

        >

          <img 
            onClick = {()=>{
              if(input.length > 0){
                onSend(input)
                setInput("");
              }
            }}
            style = {{opacity: input.length > 0 ? 1 : 0.5}} 
            className="send-btn-icon" 
            src="icon/send_FILL0_wght200_GRAD0_opsz24.svg" />

        </div>
        
      </div>




    </>
  )
}

export default WordInput