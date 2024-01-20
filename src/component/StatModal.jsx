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
              <td>{wm.rule.word_list.length}</td>
            </tr>
            <tr>
              <td>음절 수</td>
              <td>{wm.char_list.length}</td>
            </tr>
            <tr>
              <td>승리음절 수</td>
              <td>{wm.win_char_set.size}</td>
            </tr>
            <tr>
              <td>패배음절 수</td>
              <td>{wm.los_char_set.size}</td>
            </tr>
            <tr>
              <td>주요루트음절 수</td>
              <td>{wm.routeCirChar.size}</td>
            </tr>
            <tr>
              <td>루트 복잡도</td>
              <td>{Math.round((function () { let i = 0; wm.routeCirChar.forEach((x) => {
                
                 i += (wm.route_cir_word_class.get(x).content["route"] ? wm.route_cir_word_class.get(x).content["route"].size : 0 +
                  wm.route_cir_word_class.get(x).content["returning"] ? wm.route_cir_word_class.get(x).content["returning"].size : 0); 
                }); return i; }()) / (wm.routeCirChar.size) * 10000) / 10000}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )
}