function TextoGeral({texts}){
    return(
        <texto-geral className="general-width justify">
            {texts.map((text)=>(
                <div className="guidelines">
                    <h1 className="center">{text.title}</h1> 
                    
                    {text.content.map((p)=>(
                        <p>{p.txt}</p>
                    ))}
                </div>
            ))}
        </texto-geral>
    );
}

export default TextoGeral