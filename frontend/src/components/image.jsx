function DisplayImage({src, alt, size}){
    let img_class = "";

    switch(size){
        case "mini":
            img_class = "img-mini";
            break;
        case "small":
            img_class = "img-small";
            break;
        case "medium":
            img_class = "img-medium";
            break;
        case "big":
            img_class = "img-big";
            break;
        default:
            img_class = "img-medium";
            break;
    }

    return (
        <figure>
            <img src={src} alt={alt || ""} className={img_class} />
        </figure>
    );
}

export default DisplayImage