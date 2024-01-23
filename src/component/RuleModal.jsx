import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useRef, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';


function Setting1({dict, setDict}) {
  
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="dict">
        <span className="title">사전</span>
        <Form.Select aria-label="Default select example" value={dict} onChange={(e) => { setDict(parseInt(e.target.value)); }}>
          <option value="0">(구)표준국어대사전</option>
          <option value="3">(신)표준국어대사전</option>
          <option value="1">우리말샘</option>
          {/* <option value="2">한국어기초사전</option> */}
          
        </Form.Select>

      </div>
    </div>
  )
}


function ToggleBtn({value, defaultChecked, onChange, className, disabled, children}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <ToggleButton
      id={`toggle-check${value}`}
      type="checkbox"
      variant="outline-dark"
      checked={checked}
      onChange={(e) => {
        
        setChecked(e.currentTarget.checked)
        onChange(e)
      }}
      value={value}
      className={className}
      disabled = {disabled}

    >
      {children}
    </ToggleButton>
  )
}

function updateArr(e, arr, setArr) {
  if(e.target.checked){
    setArr([...arr, parseInt(e.target.value[e.target.value.length - 1])]);
    
  }
  else{
    setArr(arr.filter(a => a !== parseInt(e.target.value[e.target.value.length - 1])))
    
  }
  
  
}

function Setting2({pos, setPos}) {
  const onChange = e => updateArr(e, pos,setPos)
  
  return (
    <div className="setting-wrap">
      <div className="setting-toggle" id="pos">
        <div className="title">품사</div>
        <div className="toggle-box">
          <ToggleBtn value="0" defaultChecked = {pos.includes(0)} onChange={onChange}>명사</ToggleBtn>
          <ToggleBtn value="1" defaultChecked = {pos.includes(1)} onChange={onChange}>의존명사</ToggleBtn>
          <ToggleBtn value="2" defaultChecked = {pos.includes(2)} onChange={onChange}>대명사</ToggleBtn>
          <ToggleBtn value="3" defaultChecked = {pos.includes(3)} onChange={onChange}>수사</ToggleBtn>
          <ToggleBtn value="4" defaultChecked = {pos.includes(4)} onChange={onChange}>부사</ToggleBtn>
          <ToggleBtn value="5" defaultChecked = {pos.includes(5)} onChange={onChange}>관형사</ToggleBtn>
          <ToggleBtn value="6" defaultChecked = {pos.includes(6)} onChange={onChange}>감탄사</ToggleBtn>
          <ToggleBtn value="7" defaultChecked = {pos.includes(7)} onChange={onChange}>구</ToggleBtn>
        </div>
      </div>
    </div>

  )
}
function Setting3({cate, setCate, disabled}) {
  const onChange = e => updateArr(e, cate,setCate)
  
  return (

    <div className="setting-wrap">
      <div className="setting-toggle" id="cate">
        <div className="title">범주</div>
        <div className="toggle-box">
          <ToggleBtn value="10" disabled = {disabled} defaultChecked = {cate.includes(0)} onChange={onChange}>일반어</ToggleBtn>
          <ToggleBtn value="11" disabled = {disabled} defaultChecked = {cate.includes(1)} onChange={onChange}>방언</ToggleBtn>
          <ToggleBtn value="12" disabled = {disabled} defaultChecked = {cate.includes(2)} onChange={onChange}>북한어</ToggleBtn>
          <ToggleBtn value="13" disabled = {disabled} defaultChecked = {cate.includes(3)} onChange={onChange}>옛말</ToggleBtn>
        </div>
      </div>
    </div>
  )
}


function Setting4({len, setLen}) {
  const onChange = e => updateArr(e, len,setLen)
  
  return (
    <div className="setting-wrap">
      <div className="setting-range" id="len">
        <div className="title">글자수</div>
        <div className="range-box">
          <ToggleBtn value="20" defaultChecked = {len.includes(0)} onChange={onChange}>2</ToggleBtn>
          <ToggleBtn value="21" defaultChecked = {len.includes(1)} onChange={onChange}>3</ToggleBtn>
          <ToggleBtn value="22" defaultChecked = {len.includes(2)} onChange={onChange}>4</ToggleBtn>
          <ToggleBtn value="23" defaultChecked = {len.includes(3)} onChange={onChange}>5</ToggleBtn>
          <ToggleBtn value="24" defaultChecked = {len.includes(4)} onChange={onChange}>6</ToggleBtn>
          <ToggleBtn value="25" defaultChecked = {len.includes(5)} onChange={onChange}>7</ToggleBtn>
          <ToggleBtn value="26" defaultChecked = {len.includes(6)} onChange={onChange}>8</ToggleBtn>
          <ToggleBtn value="27" defaultChecked = {len.includes(7)} onChange={onChange}>9</ToggleBtn>
          <ToggleBtn value="28" defaultChecked = {len.includes(8)} onChange={onChange}>...</ToggleBtn>

        </div>
      </div>
    </div>
  )
}

function Setting5({chan, setChan}) {
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="chan">
        <div className="title">두음법칙</div>
        <Form.Select aria-label="Default select example" value={chan} onChange={(e) => { setChan(parseInt(e.target.value)); }}>
          <option value="0">없음</option>
          <option value="1">표준</option>
          <option value="2">ㄹ&#8594;ㄴ&#8594;ㅇ</option>
          <option value="3">ㄹ&#8644;ㄴ&#8644;ㅇ</option>
        </Form.Select>
      </div>
    </div>
  )
}


function Setting6({headDir , setHeadDir , headIdx , setHeadIdx , tailDir , setTailDir , tailIdx , setTailIdx , isHeadValid , isTailValid}) {


  return (
    <>
      <div className="setting-wrap">
        <div className="setting-select-index" id="head">
          <span className="title">첫글자</span>
          <Form.Select 
            defaultValue={`${headDir}`} 
            aria-label="Default select example" 
            onChange={e=>{setHeadDir(parseInt(e.target.value))}} 
            name = "headDir"
          >
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>

          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="headIdx"
              defaultValue={`${headIdx}`}
              onChange={e=>{setHeadIdx(parseInt(e.target.value))}}
              isInvalid={!isHeadValid}
            />
            <span className='index-text'>번째</span>
            <Form.Control.Feedback type="invalid">글자수의 최솟값보다 작거나 같아야 합니다!</Form.Control.Feedback>
          </div>

        </div>
      </div>
      <div className="setting-wrap">
        <div className="setting-select-index" id="tail">
          <span className="title">끝글자</span>
          <Form.Select 
            defaultValue={`${tailDir}`} 
            aria-label="Default select example" 
            onChange={e=>{setTailDir(parseInt(e.target.value))}} 
            name = "tailDir"
          >
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>
          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="tailIdx"
              defaultValue={`${tailIdx}`}
              onChange={e=>{setTailIdx(parseInt(e.target.value))}}
              isInvalid={!isTailValid}
            />
            <span className='index-text'>번째</span>
            <Form.Control.Feedback type="invalid">글자수의 최솟값보다 작거나 같아야 합니다!</Form.Control.Feedback>
          </div>
        </div>
      </div>
    </>
  )
}

function Setting7({manner, setManner}) {
  return (

    <div className="setting-wrap">
      <div className="setting-check" id="menner">
        <div className="title">
        <Form.Check
        reverse
            onChange={e=>{setManner(e.target.checked)}}
            defaultChecked={manner}
            inline
            label="한방단어 금지"
            name="manner"
            type="checkbox"
            id="manner"
          /></div>
          
      </div>
    </div>
  )
}


function RuleModal({rule, setRule, setIsLoading, modalShow, setModalShow}) {
  const [dict, setDict] = useState(rule.dict)
  const [pos, setPos] = useState(rule.pos)
  const [cate, setCate] = useState(rule.cate)
  const [len, setLen] = useState(rule.len)
  const [chan, setChan] = useState(rule.chan)
  const [headDir, setHeadDir] = useState(rule.headDir)
  const [headIdx, setHeadIdx] = useState(rule.headIdx)
  const [tailDir, setTailDir] = useState(rule.tailDir)
  const [tailIdx, setTailIdx] = useState(rule.headIdx)
  const [manner, setManner] = useState(rule.manner)
  
  const [isHeadValid, setIsHeadValid] = useState(true);
  const [isTailValid, setIsTailValid] = useState(true);
  const [disabled, setDisabled] = useState(rule.dict === 0 || rule.dict === 2 || rule.dict === 3)

  useEffect(
    ()=>{
      const minLen = Math.min(...len) + 2

      setIsHeadValid(typeof headIdx === "number" && headIdx <= minLen && headIdx > 0)
      setIsTailValid(typeof tailIdx === "number" && tailIdx <= minLen && tailIdx > 0)

    }, [len, headIdx, tailIdx]
  )
  
  useEffect(
    ()=>{
      if(dict === 0 || dict === 2 || dict === 3){
        setDisabled(true);
      }
      else{
        setDisabled(false);
      }
    },
    [dict]
  )
  useEffect(()=>{
    setDict(rule.dict);
    setPos(rule.pos);
    setLen(rule.len);
    setChan(rule.chan);
    setHeadDir(rule.headDir);
    setHeadIdx(rule.headIdx);
    setTailDir(rule.tailDir);
    setTailIdx(rule.headIdx);
    setManner(rule.manner);},
    [modalShow]
  )
  





  return (
    <Modal
      show = {modalShow}
      onHide = {() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable="true"
      centered
      className="rule-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          룰 설정
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Setting1 dict = {dict} setDict = {setDict}/>
        <Setting2 pos = {pos} setPos = {setPos} />
        <Setting3 cate = {cate} setCate = {setCate} disabled = {disabled}/>
        <Setting4 len = {len} setLen = {setLen}/>
        <Setting5 chan = {chan} setChan = {setChan}/>
        <Setting6 
          headDir ={headDir} setHeadDir = {setHeadDir} 
          headIdx = {headIdx} setHeadIdx = {setHeadIdx} 
          tailDir = {tailDir} setTailDir = {setTailDir} 
          tailIdx = {tailIdx} setTailIdx = {setTailIdx} 
          isHeadValid = {isHeadValid} isTailValid = {isTailValid}/>
        <Setting7
          manner = {manner} setManner = {setManner}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={
          () => {
            if(!isHeadValid || !isTailValid) return;
            setRule({dict,pos,cate,len,chan,headDir,headIdx,tailDir,tailIdx,manner})
            setModalShow(false)
            setIsLoading(true)
          }}>완료</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RuleModal
