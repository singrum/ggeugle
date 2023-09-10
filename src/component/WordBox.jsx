import CharButtonCard from "./CharButtonCard"

function WordBox(props) {
  return (
    <div className="btn-card-set">
        {props.children}
    </div>
  )
}

export default WordBox