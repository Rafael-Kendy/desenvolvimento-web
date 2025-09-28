import bg from "./assets/img/main-bg.png";

function Hero(){
    return(
        <hero className="center">
            <div className="general-width">
                <h1>
                    Sua jornada no <span className="gold bold">mundo digital</span> começa aqui
                </h1>
                <p className="subtitle dark-gray">
                    Clique na imagem do nosso <span className="gold bold">logo</span> para acessar o guia básico.<br />
                    Ou então clique <a href="#" className="blue bold">aqui</a> para ver todos os guias.
                </p>
            </div>

            <figure className="main-bg">
                <img src={bg} alt="Mountains" />
            </figure>
        </hero>
    );
}

export default Hero