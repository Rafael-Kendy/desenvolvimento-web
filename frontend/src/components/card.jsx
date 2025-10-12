import DisplayImage from "./image";

function Card({title, text, color, src, alt, size}){
    let card_class = "";

    switch(size){
        case "mini":
            card_class = "card-mini";
            break;
        case "small":
            card_class = "card-small";
            break;
        case "medium":
            card_class = "card-medium";
            break;
        case "big":
            card_class = "card-big";
            break;
        default:
            card_class = "card-medium";
            break;
    }

    switch(color){
        case "lightgray":
            card_class += " bg-lightgray";
            break;
        default:
            card_class += " bg-lightgray";
            break;
    }

    return(
        <div className={card_class}>
            <DisplayImage src={src} alt={alt} size={size} />

            <div className="center">
                {title && ( <h3>{title}</h3> )}
                {text && ( <p>{text}</p> )}
            </div>

        </div>
    )
}

export default Card