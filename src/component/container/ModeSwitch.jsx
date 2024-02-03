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
// 흔척 척촉 촉규 규획 획득 득롱망촉 촉륜 륜습 습득 득업 업시름 늠준 준척 척석희 희
function ModeSwitch({mode, setmode}) {
    
    return (
      <>
        <div className="switch-mode-btn-set">
            <RadioButton style = {{color : mode === "0" ? "#222222": "#666666", fontWeight : mode === "0" ? "600": "500"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="0">검색</RadioButton>
            <RadioButton style = {{color : mode === "2" ? "#222222": "#666666",fontWeight : mode === "2" ? "600": "500"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="2">분석</RadioButton>
            <RadioButton style = {{color : mode === "1" ? "#222222": "#666666",fontWeight : mode === "1" ? "600": "500"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="1">연습</RadioButton>
            <RadioButton style = {{color : mode === "3" ? "#222222": "#666666",fontWeight : mode === "3" ? "600": "500"}} mode = {mode} setmode = {setmode} variant='light' className = "switch-mode-btn" value="3">룰 정보</RadioButton>
        </div>
      </>
    )
  }
  
export default ModeSwitch