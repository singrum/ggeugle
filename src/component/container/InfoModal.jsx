import Modal from 'react-bootstrap/Modal';

export default function StatModal({ modalShow, setModalShow }) {
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable="true"
      centered
      className="info-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          정보
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span className="info-logo-set">
          <img className="logo-img" src="img/ggeugle_logo_small.png"></img>
          <span className='logo-text'>끄글</span>
        </span>
        
        <h2 className='info-text title-text'>끝말잇기 검색엔진</h2>
        <span className='info-text'>
          <ul>
          {/* 2,250,227,712 */}
            <li>22억 가지 이상의 끝말잇기 커스텀 룰 지원</li>
            <li>한방단어, 유도단어, 방어단어, 루트단어 분류 알고리즘 탑재</li>
            <li>MCTS 알고리즘을 통한 루트전 분석</li>
          </ul>
        </span>
        <br />
        <h2 className='info-text title-text'>제작자</h2>
        <span className='info-text'>
          강효민<br/>
        </span>
        <br />
        <h2 className='info-text title-text'>DB 제공</h2>
        <span className='info-text' >
          <div className='info-link' onClick={() => window.open('https://github.com/korean-word-game/db')}><img className="link-icon" src={"icon/link_FILL0_wght400_GRAD0_opsz24.svg"} /><span>(구)표준국어대사전</span></div>
          <div className='info-link' onClick={() => window.open('https://stdict.korean.go.kr/main/main.do')}><img className="link-icon" src={"icon/link_FILL0_wght400_GRAD0_opsz24.svg"} /><span>(신)표준국어대사전</span></div>
          <div className='info-link' onClick={() => window.open('https://opendict.korean.go.kr/main')}><img className="link-icon" src={"icon/link_FILL0_wght400_GRAD0_opsz24.svg"} /><span>우리말샘</span></div>
        </span>
        <br />
        <h2 className='info-text title-text'>링크</h2>
        <span className='info-text' >
          <div className='info-link' onClick={() => window.open('https://github.com/singrum/ggeugle')}><img className="link-icon" src={"icon/github-mark.svg"} /><span>Github</span></div>
          <div className='info-link' onClick={() => window.open('mailto:miamiq0000@gmail.com')}><img className="link-icon" src={"icon/mail_FILL0_wght400_GRAD0_opsz24.svg"} /><span>Email</span></div>
        </span>


      </Modal.Body>
    </Modal>
  )
}