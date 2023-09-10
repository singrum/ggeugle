
function CharButton(props){
	
	return(
		<span 
			className={`char-btn char-button-${props.type}-${props.strength}`}
			{...props}
		>
			{props.children}
		</span>
	)
}

export default CharButton;