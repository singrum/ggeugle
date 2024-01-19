import ToggleButton from 'react-bootstrap/ToggleButton';
function SwitchMode(props) {
  
  
    function RadioButton(props2) {
      return (
        <div className='toggle-wrap'>
          <ToggleButton
            type="radio"
            name="mode-radio"
            
            id={`mode-${props2.value}`}
            checked={props.mode === props2.value}
            onChange={(e) => props.setMode(e.currentTarget.value)}
            
            {...props2}
          >
            {props2.children}
          </ToggleButton>
        </div>
      )
  
    }
  
    return (
      <>
        <div className="switch-mode-btn-set">
            <RadioButton variant='light' className = "switch-mode-btn" value="0">검색기</RadioButton>
            <RadioButton variant='light' className = "switch-mode-btn" value="1">연습</RadioButton>
        </div>
      </>
    )
  }
  
export default SwitchMode