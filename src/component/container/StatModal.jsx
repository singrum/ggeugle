import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useContext } from 'react';
import { WCcontext } from '../../context/WCcontext';

export default function StatModal({modalShow, setModalShow}) {
  const {WC, setWC} = useContext(WCcontext)
  return WC && (
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
              <td>{WC.word_list.length}</td>
            </tr>
            <tr>
              <td>음절 수</td>
              <td>{Object.keys(WC.charMap).length}</td>
            </tr>
            <tr>
              <td>승리음절 수</td>
              <td>{WC.winChars.length + WC.winCirChars.length}</td>
            </tr>
            <tr>
              <td>패배음절 수</td>
              <td>{WC.losChars.length + WC.losCirChars.length}</td>
            </tr>
            <tr>
              <td>주요루트음절 수</td>
              <td>{WC.maxRouteComp.length}</td>
            </tr>
            <tr>
              <td>루트 복잡도</td>
              <td>{WC.maxRouteComp.length === 0 ? 0 : Math.round((function () { let i = 0; WC.maxRouteComp.forEach((x) => {
                
                 i += (WC.charMap[x].wordClass["ROUTE"] ? WC.charMap[x].wordClass["ROUTE"].length : 0 +
                 WC.charMap[x].wordClass["RETURN"] ? WC.charMap[x].wordClass["RETURN"].length : 0); 
                }); return i; }()) / (WC.maxRouteComp.length) * 10000) / 10000}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )
}