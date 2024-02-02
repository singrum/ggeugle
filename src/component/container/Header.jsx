import { useState } from 'react';
import RuleModal from './RuleModal'
import InfoModal from './InfoModal'


function MenuBtn({caption, iconSrc, name, onClick}) {
  return (
  <span className={`btn-wrap chatbot ${name}`} onClick = {onClick}>
    <img className="btn-icon" src={iconSrc} />
    {/* <div className="caption">{caption}</div> */}
  </span>
  )
}

function Header() {
  const [ruleModalShow, setRuleModalShow] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);
  return (
    <>
      <div className='header'>
        <span className="logo-set" onClick={()=>window.location.reload()}>
          <img className="logo-img" src="img/ggeugle_logo_small.png"></img>
          <span className='logo-text'>끄글</span>
        </span>

        <span className="menu-set">
          <span className="menu-wrap">
            <MenuBtn name="setting" caption="룰 설정" iconSrc="icon/settings_FILL0_wght400_GRAD0_opsz24.svg" onClick={() => setRuleModalShow(true)} />
          </span>
          <span className="menu-wrap">
            <MenuBtn name="setting" caption="정보" iconSrc="icon/info_FILL0_wght400_GRAD0_opsz24.svg" onClick={() => setInfoModalShow(true)} />
          </span>
          
        </span>
      </div>
      <InfoModal
        modalShow={infoModalShow}
        setModalShow={setInfoModalShow}
      />

      <RuleModal
        modalShow={ruleModalShow}
        setModalShow={setRuleModalShow}
      />
    </>


  )
}
  
export default Header