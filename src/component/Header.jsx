import React, { useState } from 'react';
import RuleModal from './RuleModal'

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showSettingModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const hideSettingModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className='header'>

        <span className="logo-set">
          <img className="logo-img" src="img/ggeugle_logo_small.png"></img>
          <span className='logo-text'>끄글</span>  
        </span>

        <span className="menu-set">
          <span className="btn-wrap chatbot">
            <img className="btn-img" src="icon/forum_FILL0_wght200_GRAD0_opsz24.svg" style={{ width : "30px", height : "30px"}}/>
            <div className="caption">챗봇</div>
          </span>
          <span className="btn-wrap stat">
            <img className="btn-img" src="icon/query_stats_FILL0_wght200_GRAD0_opsz24.svg" style={{ width : "30px", height : "30px"}}/>
            <div className="caption">통계</div>
          </span>
          <span className="btn-wrap setting" onClick={showSettingModal}>
            <img className="btn-img" src="icon/tune_FILL0_wght200_GRAD0_opsz24.svg" style={{ width : "30px", height : "30px"}}/>
            <div className="caption">룰 설정</div>
          </span>
        </span>
        
      </div>
      {isModalOpen && <RuleModal/>}
    </>
  )
}
  
export default Header