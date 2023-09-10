function Loading(props){
    return (
        <div className = "loading-backdrop" {...props}>
            <div className = "loading-box">
                <img className = "loading-img" src="img/ggeugle_logo.png"/>
                <div className = "loading-text">로딩중...</div>
            </div>
        </div>
    )
}

export default Loading;