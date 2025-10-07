function Documento({docs}){
    return(
        <documento>
            <div className="bg-lightgray">
                <div className="general-width">
                    {docs.map((doc)=>(
                        <object data={doc.path} type={doc.type} className={doc.class} width="100%" height="1200px">
                            <p>Não foi possível exibir o documento.</p>
                        </object>
                    ))}
                </div>
            </div>
        </documento>
    );
}

export default Documento