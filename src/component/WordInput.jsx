import { useState, useEffect} from 'react'


function WordInput(props) {
  const [sendable, setSendable] = useState(false)
  const [input, setInput] = useState("")
  const [copyable, setCopyable] = useState(false)

  useEffect(()=>{
    
    setCopyable(props.history.length > 0)
  }, [props.history])
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
          className="input-btn-box" 
          

        >
          <img 
            onClick = {()=>{
              if(input.length > 0){
                props.setSendSign(true)
                props.setPracticeInput(input)
                setInput("");
              }
            }}
            style = {{opacity: sendable ? 1 : 0.5}} 
            className="send-btn-icon" 
            src="icon/send_FILL0_wght200_GRAD0_opsz24.svg" />
          <img
            onClick = {()=>{
              if(props.history.length > 0){
                let text = "나 vs 끄글\n"
                for(let i = 0; i < props.history.length/2; i++){
                  text += "\n"
                  text += props.history[i * 2]
                  text += " "
                  if(props.history[i * 2 + 1]){
                    text += props.history[i * 2 + 1]
                  }
                  
                }

                navigator.clipboard.writeText(text)
              }
            }} 
            style = {{opacity: copyable ? 1 : 0.5}}
            className="copy-icon" 
            src="icon/content_paste_FILL0_wght200_GRAD0_opsz24.svg" />
        </div>
        
      </div>




    </>
  )
}

export default WordInput