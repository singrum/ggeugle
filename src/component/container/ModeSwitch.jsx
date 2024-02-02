import ToggleButton from 'react-bootstrap/ToggleButton';
function RadioButton({mode, setmode, ...props}) {
  return (
    <div className='toggle-wrap'>
      <ToggleButton
        type="radio"
        name="mode-radio"
        
        id={`mode-${props.value}`}
        checked={mode === props.value}
        onChange={(e) => setmode(e.currentTarget.value)}
        
        {...props}
      >
        {props.children}
      </ToggleButton>
    </div>
  )
}

function ModeSwitch({mode, setmode}) {
    
    return (
      <>
        <div className="switch-mode-btn-set">
            <RadioButton style = {{color : mode === "0" ? "#212529": "#6c757d"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="0">검색</RadioButton>
            <RadioButton style = {{color : mode === "2" ? "#212529": "#6c757d"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="2">분석</RadioButton>
            <RadioButton style = {{color : mode === "1" ? "#212529": "#6c757d"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="1">연습</RadioButton>
            <RadioButton style = {{color : mode === "3" ? "#212529": "#6c757d"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="3">룰 정보</RadioButton>
        </div>
      </>
    )
  }
  
export default ModeSwitch