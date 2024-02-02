import CharButton from "./CharButton"
import ProgressBar from 'react-bootstrap/ProgressBar';

function Chart({data}){
  const words = Object.keys(data).sort((a,b)=>data[b] - data[a])
  const chart = words.map(word=>(<div className = "chart-item" key = {word}>
    <CharButton key={`${word}`} type="cir" strength={`${0}`}>{word}
      <img className="delete-icon" src="icon/add_FILL0_wght400_GRAD0_opsz24.svg" /></CharButton>
    <span className="progress-bar-wrap">
      <ProgressBar className="analysis-bar" now={data[word] * 100} label={`${Math.round(data[word] * 10000)/100}%`} />
    </span>
  </div>))
  
  return (
    <>
      <div className="chart-wrap">
      {chart}    
      </div>
     
    </>
  )
}

export default Chart