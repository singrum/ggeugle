import { useState } from 'react';
import RuleModal from './RuleModal'

function Header(props) {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div className='header'>

        <span className="logo-set">
          <img className="logo-img" src="img/ggeugle_logo_small.png"></img>
          <span className='logo-text'>끄글</span>  
        </span>

        <span className="menu-set">
          <span className="btn-wrap chatbot">
            <img className="btn-icon" src="icon/forum_FILL0_wght200_GRAD0_opsz24.svg"/>
            <div className="caption">챗봇</div>
          </span>
          <span className="btn-wrap stat">
            <img className="btn-icon" src="icon/query_stats_FILL0_wght200_GRAD0_opsz24.svg" />
            <div className="caption">통계</div>
          </span>
          <span className="btn-wrap setting" onClick={() => setModalShow(true)}>
            <img className="btn-icon" src="icon/tune_FILL0_wght200_GRAD0_opsz24.svg" />
            <div className="caption">룰 설정</div>
          </span>
        </span>
        
      </div>
      <RuleModal
        rule = {props.rule}
        setRule = {props.setRule}
        setIsLoading = {props.setIsLoading}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}
  
export default Header