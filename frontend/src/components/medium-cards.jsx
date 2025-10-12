function MediumCards({content}){
    return (
        <div>
            <div className="cards">
                {content.map((card)=>(
                    <div key={card.title} className="card bg-lightgray">
                        <figure>
                            <img src={card.img} alt={card.alt} className="img-small"/>
                        </figure>

                        {card.title && (
                            <h3>{card.title}</h3>
                        )}
                        {card.text && (
                            <p>{card.text}</p>
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default MediumCards

