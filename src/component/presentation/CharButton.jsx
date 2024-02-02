
function CharButton(props){
	
	return(
		<span 
			className={`char-btn char-button-${props.type}-${props.strength}`}
			{...props}
		>
			{props.children}		
			
			{props.returning && (<img className="returning-icon" src="icon/cached_FILL0_wght400_GRAD0_opsz24.svg"/>)}
			
			
			
		</span>
	)
}

export default CharButton;