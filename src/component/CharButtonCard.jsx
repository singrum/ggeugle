function CharButtonCard(props) {
	return (
		<div className="char-btn-card">
			<span className="card-caption">
				{props.caption}
			</span>
			<div className='char-container'>
				{props.children}
			</div>
		</div>
	)
}
export default CharButtonCard;