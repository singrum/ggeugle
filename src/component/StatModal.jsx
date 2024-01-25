import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';

export default function StatModal({ wm, modalShow, setModalShow }) {
  
  
  return wm && (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable="true"
      centered
      className="rule-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          통계
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless striped>
          <thead>
            <tr>
              <th>지표</th>
              <th>값</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>단어 수</td>
              <td>{wm.word_list.length}</td>
            </tr>
            <tr>
              <td>음절 수</td>
              <td>{Object.keys(wm.charMap).length}</td>
            </tr>
            <tr>
              <td>승리음절 수</td>
              <td>{wm.winChars.length + wm.winCirChars.length}</td>
            </tr>
            <tr>
              <td>패배음절 수</td>
              <td>{wm.losChars.length + wm.losCirChars.length}</td>
            </tr>
            <tr>
              <td>주요루트음절 수</td>
              <td>{wm.maxRouteComp.length}</td>
            </tr>
            <tr>
              <td>루트 복잡도</td>
              <td>{wm.maxRouteComp.length === 0 ? 0 : Math.round((function () { let i = 0; wm.maxRouteComp.forEach((x) => {
                
                 i += (wm.charMap[x].wordClass["ROUTE"] ? wm.charMap[x].wordClass["ROUTE"].length : 0 +
                  wm.charMap[x].wordClass["RETURN"] ? wm.charMap[x].wordClass["RETURN"].length : 0); 
                }); return i; }()) / (wm.maxRouteComp.length) * 10000) / 10000}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )
}