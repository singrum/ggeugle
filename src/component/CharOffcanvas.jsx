import Offcanvas from 'react-bootstrap/Offcanvas';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState } from 'react';
import CharButton from './CharButton';


function CharOffcanvas(props) {
  
  
  function RadioButton(props2) {
    return (
      <div className='toggle-wrap'>
        <ToggleButton
          type="radio"
          name="radio"
          id={`radio-${props2.value}`}
          checked={props.radioValue === props2.value}
          onChange={(e) => props.setRadioValue(e.currentTarget.value)}
          className="radio-btn"
          {...props2}
        >
          {props2.children}
        </ToggleButton>
      </div>
    )


  }

  return (
    <>
      <Offcanvas
        show = {props.show}
        onHide = {props.onHide}
        placement='bottom'
        scroll={true}
        backdrop= {false}
      >
        <Offcanvas.Header closeButton>
          <div className="radio-btn-set">
            <RadioButton variant='outline-primary' value="0">승리음절</RadioButton>
            <RadioButton variant='outline-danger' value="1">패배음절</RadioButton>
            <RadioButton variant='outline-success' value="2">순환음절</RadioButton>
          </div>

        </Offcanvas.Header>
        <Offcanvas.Body>
          {props.children}

        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default CharOffcanvas