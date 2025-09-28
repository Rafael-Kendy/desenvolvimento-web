function TextoGeral({texts}){
    return(
        <texto-geral className="justify">
            {texts.map((text)=>(
                <div key={text.index} className={text.index%2===0 ? "bg-white" : "bg-lightgray"}>
                    <div className="general-width">
                        <div className="guidelines">
                            {text.index==0 ? (
                                <h1 className="center">{text.title}</h1> 
                            ):(
                                <h2 className="center">{text.title}</h2> 
                            )}
                            {text.content.map((p)=>(
                                <p>{p.txt}</p>
                            ))}
                        </div>
                    </div>
                </div>
                ))}
        </texto-geral>
    );
}

export default TextoGeral