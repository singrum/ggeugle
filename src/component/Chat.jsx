import Spinner from 'react-bootstrap/Spinner';

function Chat(props) {
  return (
    <>
    <div className='chat-wrapper'>
    <div className={`chat chat-${props.sender}`}>
        {props.loading ? 
        <>
          <Spinner className = "spinner" animation="border" variant="dark" />
        </>
        : props.children}
      </div>
    </div>
      
    </>
  )
}

export default Chat