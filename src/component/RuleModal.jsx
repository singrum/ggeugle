import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

function Setting1(props) {
  const [select, setSelect] = useState('0')
  useEffect(() => {
    props.setRuleInfo({ ...props.ruleInfo, "dict": select })
  }, [select])
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="dict">
        <span className="title">사전</span>
        <Form.Select aria-label="Default select example" value={select} onChange={(e) => { setSelect(parseInt(e.target.value)); }}>
          <option value="0">표준국어대사전</option>
          <option value="1">우리말샘</option>
          <option value="2">한국어기초사전</option>
        </Form.Select>

      </div>
    </div>
  )
}
function Setting2(props) {
  const [select, setSelect] = useState(0)
  useEffect(() => {
    props.setRuleInfo({ ...props.ruleInfo, "chan": select })
  }, [select])
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="chan">
        <div className="title">두음법칙</div>
        <Form.Select aria-label="Default select example" value={select} onChange={(e) => { setSelect(parseInt(e.target.value)) }}>
          <option value="0">없음</option>
          <option value="1">표준</option>
          <option value="2">ㄹ&#8594;ㄴ&#8594;ㅇ</option>
          <option value="3">ㄹ&#8644;ㄴ&#8644;ㅇ</option>
        </Form.Select>
      </div>
    </div>
  )
}

function ToggleBtn(props) {
  const [checked, setChecked] = useState(props.defaultChecked);
  return (
    <ToggleButton
      id={`toggle-check${props.value}`}
      type="checkbox"
      variant="outline-dark"
      checked={checked}
      onChange={(e) => {
        setChecked(e.currentTarget.checked)
        props.onChange(e)
      }}
      value={props.value}
      className={props.class}

    >
      {props.children}
    </ToggleButton>
  )
}

function updateCode(e, code, setCode) {
  setCode(code + 2 ** e.target.value.charAt(e.target.value.length - 1) * (e.target.checked ? 1 : -1));
}

function Setting3(props) {
  const [code, setCode] = useState(1);
  useEffect(() => {
    props.setRuleInfo({ ...props.ruleInfo, "pos": code })
  }, [code])
  const onChange = e => updateCode(e, code, setCode)
  return (
    <div className="setting-wrap">
      <div className="setting-toggle" id="pos">
        <div className="title">품사</div>
        <div className="toggle-box">
          <ToggleBtn value="0" defaultChecked={true} onChange={onChange}>명사</ToggleBtn>
          <ToggleBtn value="1" onChange={onChange}>의존명사</ToggleBtn>
          <ToggleBtn value="2" onChange={onChange}>대명사</ToggleBtn>
          <ToggleBtn value="3" onChange={onChange}>수사</ToggleBtn>
          <ToggleBtn value="4" onChange={onChange}>부사</ToggleBtn>
          <ToggleBtn value="5" onChange={onChange}>관형사</ToggleBtn>
          <ToggleBtn value="6" onChange={onChange}>감탄사</ToggleBtn>
        </div>
      </div>
    </div>

  )
}
function Setting4(props) {
  const [code, setCode] = useState(15);
  useEffect(() => {
    props.setRuleInfo({ ...props.ruleInfo, "cate": code })
  }, [code])
  const onChange = e => updateCode(e, code, setCode)

  return (

    <div className="setting-wrap">
      <div className="setting-toggle" id="cate">
        <div className="title">범주</div>
        <div className="toggle-box">
          <ToggleBtn value="10" defaultChecked={true} onChange={onChange}>일반어</ToggleBtn>
          <ToggleBtn value="11" defaultChecked={true} onChange={onChange}>방언</ToggleBtn>
          <ToggleBtn value="12" defaultChecked={true} onChange={onChange}>북한어</ToggleBtn>
          <ToggleBtn value="13" defaultChecked={true} onChange={onChange}>옛말</ToggleBtn>
        </div>
      </div>
    </div>
  )
}


function Setting5(props) {
  const [code, setCode] = useState(1023);
  useEffect(() => {
    props.setRuleInfo({ ...props.ruleInfo, "len": code })
  }, [code])
  const onChange = e => {
    updateCode(e, code, setCode)

  }
  return (
    <div className="setting-wrap">
      <div className="setting-range" id="len">
        <div className="title">글자수</div>
        <div className="range-box">
          <ToggleBtn value="20" defaultChecked={true} onChange={onChange}>2</ToggleBtn>
          <ToggleBtn value="21" defaultChecked={true} onChange={onChange}>3</ToggleBtn>
          <ToggleBtn value="22" defaultChecked={true} onChange={onChange}>4</ToggleBtn>
          <ToggleBtn value="23" defaultChecked={true} onChange={onChange}>5</ToggleBtn>
          <ToggleBtn value="24" defaultChecked={true} onChange={onChange}>6</ToggleBtn>
          <ToggleBtn value="25" defaultChecked={true} onChange={onChange}>7</ToggleBtn>
          <ToggleBtn value="26" defaultChecked={true} onChange={onChange}>8</ToggleBtn>
          <ToggleBtn value="27" defaultChecked={true} onChange={onChange}>9</ToggleBtn>
          <ToggleBtn value="28" defaultChecked={true} onChange={onChange}>...</ToggleBtn>

        </div>
      </div>
    </div>
  )
}

function Setting6(props) {
  const [idxObj, setIdxObj] = useState({ headDir: 0, headIdx: 0, tailDir: 1, tailIdx: 0 })
  let code = 2;

  useEffect(() => {

    code = idxObj.headDir + idxObj.tailDir * 2 ** 1 + 4 * (idxObj.headIdx + idxObj.tailIdx * 10)
    props.setRuleInfo({ ...props.ruleInfo, "idx": code })
  }, [idxObj])

  const onChange = (e, type) => {
    const newObj = { ...idxObj }
    if (type === "headIdx" || type === "tailIdx") {
      newObj[type] = parseInt(e.target.value) - 1
    } else {
      newObj[type] = parseInt(e.target.value)
    }
    setIdxObj(newObj)
  }
  return (
    <>
      <div className="setting-wrap">
        <div className="setting-select-index" id="head">
          <span className="title">첫글자</span>
          <Form.Select aria-label="Default select example" onChange={e => onChange(e, "headDir")}>
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>
          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="first-index"
              defaultValue='1'
              onChange={e => onChange(e, "headIdx")}
              isInvalid={!props.isValid1}
            />
            <span className='index-text'>번째</span>
            <Form.Control.Feedback type="invalid">글자수의 최솟값보다 작거나 같아야 합니다!</Form.Control.Feedback>
            
          </div>

        </div>
      </div>
      <div className="setting-wrap">
        <div className="setting-select-index" id="tail">
          <span className="title">끝글자</span>
          <Form.Select defaultValue="1" aria-label="Default select example" onChange={e => onChange(e, "tailDir")}>
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>
          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="first-index"
              defaultValue='1'
              onChange={e => onChange(e, "tailIdx")}
              isInvalid={!props.isValid2}
            />
            <span className='index-text'>번째</span>
            <Form.Control.Feedback type="invalid">글자수의 최솟값보다 작거나 같아야 합니다!</Form.Control.Feedback>
          </div>
        </div>
      </div>
    </>
  )
}


function checkValidity(ruleInfo){
  let minLen = 0;
  let q = ruleInfo.len
  while (q % 2 === 0) {
    q = Math.floor(q / 2)
    minLen++;
  }
  minLen += 2;

  const headIdx = Math.floor(ruleInfo.idx / 4) % 10
  const tailIdx = Math.floor(Math.floor(ruleInfo.idx / 4) / 10)
  let headValidity, tailValidity;
  if (!isNaN(headIdx) && (headIdx < minLen) && (headIdx >= 0)) {
    headValidity = true
  }
  else {
    headValidity = false
  }
  if (!isNaN(tailIdx) && (tailIdx < minLen) && (tailIdx >= 0)) {
    tailValidity = true
  } else {
    tailValidity = false;
  }
  return [headValidity, tailValidity]

}


function RuleModal(props) {
  const [ruleInfo, setRuleInfo] = useState({
    dict: 0,
    pos: 1,
    cate: 15,
    len: 1023,
    chan: 0,
    idx: 2
  });
  const [isValid1, setIsValid1] = useState(true);
  const [isValid2, setIsValid2] = useState(true);
  useEffect(
    ()=>{
      const validity = checkValidity(ruleInfo);
      setIsValid1(validity[0])
      setIsValid2(validity[1])
      
    }, [ruleInfo]
  )



  return (
    <Modal
      {...props}
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
        <Setting1 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo} />
        <Setting3 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo} />
        <Setting4 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo} />
        <Setting5 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo}/>
        <Setting2 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo}/>
        <Setting6 ruleInfo={ruleInfo} setRuleInfo={setRuleInfo} isValid1 = {isValid1} isValid2 = {isValid2}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={
          () => {
            if(validity[0] && validity[1]){
              props.onHide();
              
            }
          }}>완료</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RuleModal