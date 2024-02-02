
import { useState, forwardRef, useEffect } from "react";

let ChatBox = forwardRef((props, ref) => {
  
  return (
    <>
      <div className="chat-box" 
        ref = {ref}
      >
        {props.children}
      </div>
    </>
    
  )
}
)

export default ChatBox