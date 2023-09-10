import Offcanvas from 'react-bootstrap/Offcanvas';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState } from 'react';
import CharButton from './CharButton';


function CharOffcanvas(props) {
	const [radioValue, setRadioValue] = useState('0');
	function RadioButton(props){
		return(
			<div className='toggle-wrap'>
				<ToggleButton
					type="radio"
					name="radio"
					id={`radio-${props.value}`}
					checked = {radioValue === props.value}
					onChange={(e) => setRadioValue(e.currentTarget.value)}
					className ="radio-btn"
					{...props}
				>
					{props.children}
				</ToggleButton>
			</div>
		)
		
		
	}

	return (
		<>
			<Offcanvas {...props}>
				<Offcanvas.Header closeButton>
					<div className="radio-btn-set">
						<RadioButton variant='outline-primary' value = "0">승리음절</RadioButton>
						<RadioButton variant='outline-danger' value = "1">패배음절</RadioButton>
						<RadioButton variant='outline-success' value = "2">순환음절</RadioButton>
					</div>
					
				</Offcanvas.Header>
				<Offcanvas.Body>
					{props.children}
					
				</Offcanvas.Body>
			</Offcanvas>
		</>
	)
}

export default CharOffcanvas