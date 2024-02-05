import Table from 'react-bootstrap/Table';
import { useContext } from 'react';
import { WCcontext } from '../../context/WCcontext';

export default function StatMode({display}) {
  const { WC, setWC } = useContext(WCcontext)
  return WC && (
    <div style = {{display: display ? "block" : "none"}}>
      <div className='stat-box'>
      <Table borderless striped>
          <thead>
            <tr>
              <th></th>
              <th>현재룰</th>
              <th>구엜룰</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>단어 수</td>
              <td>{WC.word_list.length}</td>
              <td>265348</td>
            </tr>
            <tr>
              <td>음절 수</td>
              <td>{Object.keys(WC.charMap).length}</td>
              <td>1993</td>
            </tr>
            <tr>
              <td>승리음절 수</td>
              <td>{WC.winChars.length + WC.winCirChars.length}</td>
              <td>883</td>
            </tr>
            <tr>
              <td>패배음절 수</td>
              <td>{WC.losChars.length + WC.losCirChars.length}</td>
              <td>908</td>
            </tr>
            <tr>
              <td>주요루트음절 수</td>
              <td>{WC.maxRouteComp.length}</td>
              <td>88</td>
            </tr>
            <tr>
              <td>루트 복잡도</td>
              <td>{WC.maxRouteComp.length === 0 ? 0 : Math.round((function () { let i = 0; WC.maxRouteComp.forEach((x) => {
                 i += (WC.charMap[x].wordClass["ROUTE"] ? WC.charMap[x].wordClass["ROUTE"].length : 0); 
                }); return i; }()) / (WC.maxRouteComp.length) * 10000) / 10000}</td>
              <td>7.1591</td>
            </tr>
          </tbody>
        </Table>
      </div>
  
    </div>
  )
}