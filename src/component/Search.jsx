import { useState } from 'react';
import CharOffcanvas from './CharOffcanvas'

function Search(props) {
  

  const toggleOffcanvas = () => props.setOffCanvasShow(!props.offCanvasShow);
  return (
    <>
      <div className="search-box">
        <input className="search-input" type="text" id="search-box" placeholder="" maxLength="1"></input>
        <span className="prev">
          <img className="btn-icon" src="icon/arrow_back_FILL0_wght200_GRAD0_opsz24.svg"></img>
        </span>
        <span className="selection" onClick={toggleOffcanvas}>
          <img className="btn-icon" src="icon/apps_FILL0_wght200_GRAD0_opsz24.svg"></img>
        </span>
        <span className="next">
          <img className="btn-icon" src="icon/arrow_forward_FILL0_wght200_GRAD0_opsz24.svg"></img>
        </span>

      </div>
      
    </>
  )
}

export default Search