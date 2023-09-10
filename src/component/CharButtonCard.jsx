function CharButtonCard(props) {
	return (
		<div className="char-btn-card">
			{props.caption && 
			<div className="card-caption">
				{props.caption}
			</div>}
			<div className='char-container'>
				{props.children}
			</div>
		</div>
	)
}
export default CharButtonCard;