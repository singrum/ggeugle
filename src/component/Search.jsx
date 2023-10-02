import { useState } from 'react';
import CharOffcanvas from './CharOffcanvas'

function Search(props) {

  
  return (
    <>
      <div className="search-box">
        <input 
          className="search-input" 
          type="text"   
          id="search-box" 
          placeholder="" 
          maxLength="1"
          value = {props.input}
          onChange={(e) => props.setInput(e.target.value)}
        />


      </div>
      
    </>
  )
}

export default Search