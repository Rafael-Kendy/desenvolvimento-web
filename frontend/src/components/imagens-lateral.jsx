function ImagLado({content=[]}){
    return(
        <imaglado className="imag-lado">
            <div className="general-width">
                {content.map((cont, i)=>(
                    <div className={i%2===0 ? "guidelines image-text" : "guidelines image-text-inv"}>
                        <img src={cont.src} alt={cont.alt}/>
                        <div>
                            <h2>{cont.title}</h2>
                            <p class="dark-gray">{cont.txt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </imaglado>
    );
}

export default ImagLado
