export default function MenuBtn({caption, iconSrc, name, onClick}) {
  return (
  <span className={`btn-wrap chatbot ${name}`} onClick = {onClick}>
    <img className="btn-icon" src={iconSrc} />
    <div className="caption">{caption}</div>
  </span>
  )
}