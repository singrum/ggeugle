import Table from 'react-bootstrap/Table';
import { useContext, useEffect, useState } from 'react';
import { WCcontext } from '../../context/WCcontext';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

export default function StatMode({ display }) {
  const { WC, setWC } = useContext(WCcontext)
  const [winCharTable, setWinCharTable] = useState([])
  const [losCharTable, setLosCharTable] = useState([])

  useEffect(
    () => {
      if (WC) {
        setWinCharTable(Object.keys(WC.winCharClass).map(i =>
        (<tr key={`win-char-${i}`} className = "sub-row">
          <td>{`${i}턴 후 승리`}</td>
          <td>{WC.winCharClass[i].length}</td>
          <td></td>
        </tr>)
        ));
        setWinCharTable(curr=>[...curr,
        <tr key={`win-cir-char`} className = "sub-row">
            <td>{`조건부 승리`}</td>
            <td>{WC.winCirChars.length}</td>
            <td></td>
          </tr>]);
        setLosCharTable(Object.keys(WC.losCharClass).map(i =>
        (<tr key={`los-char-${-i}`} className = "sub-row">
          <td>{`${-i}턴 후 패배`}</td>
          <td>{WC.losCharClass[i].length}</td>
          <td></td>
        </tr>)
        ));
        setLosCharTable(curr=>[...curr,
          <tr key={`los-cir-char`} className = "sub-row">
              <td>{`조건부 패배`}</td>
              <td>{WC.losCirChars.length}</td>
              <td></td>
            </tr>]);
      }
    },
    [WC]
  )



  return WC && (
    <div style={{ display: display ? "block" : "none" }}>
      <div className='stat-box'>
        <Table borderless bordered >
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

            {winCharTable}




            <tr>
              <td>패배음절 수</td>
              <td>{WC.losChars.length + WC.losCirChars.length}</td>
              <td>908</td>
            </tr>
            {losCharTable}
            <tr>
              <td>루트음절 수</td>
              <td>{WC.routeChars.length}</td>
              <td>202</td>
            </tr>
            <tr className='sub-row'>
              <td>희귀루트음절 수</td>
              <td>{WC.restRouteComp.length}</td>
              <td>114</td>
            </tr>
            <tr className='sub-row'>
              <td>주요루트음절 수</td>
              <td>{WC.maxRouteComp.length}</td>
              <td>88</td>
            </tr>
            <tr className='sub-row'>
              <td>주요루트단어 수</td>
              <td>{WC.maxRouteComp.reduce((a,b)=>
                a + WC.charMap[b].wordClass["ROUTE"].length
              , 0)}</td>
              <td>630</td>
            </tr>
            <tr className='sub-row'>
              <td>주요루트단어 수(평균)</td>
              <td>{(WC.maxRouteComp.length === 0) ? 0 : Math.round(WC.maxRouteComp.reduce((a,b)=>
                a + WC.charMap[b].wordClass["ROUTE"].length
              , 0) / WC.maxRouteComp.length * 10000) / 10000}</td>
              <td>7.1591</td>
            </tr>
          </tbody>
        </Table>
      </div>

    </div>
  )
}