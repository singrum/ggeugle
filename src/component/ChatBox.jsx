
import { useState, forwardRef, useEffect } from "react";

let ChatBox = forwardRef((props, ref) => {
  const [shadow, setShadow] = useState(false)
  useEffect(()=>{
    setShadow(ref.current.scrollHeight - ref.current.scrollTop !== ref.current.clientHeight)
  })
  return (
    <>
    
      <div className="chat-box" 
      ref = {ref}
      
      onScroll={e => {
        setShadow(Math.floor(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) !== 0)}}>
        {props.children}
      </div>
      <div style = {{display : shadow ? "block" : "None"}}className="chat-box-shadow"></div>
      
    </>
    
  )
}
)

export default ChatBox