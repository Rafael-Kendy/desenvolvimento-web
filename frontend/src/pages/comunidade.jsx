import { useEffect } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import DisplayImage from "../components/image";
import Card from "../components/card";
import CardCarousel from "../components/card-carousel";

import placeHolder from "../components/assets/img/image.png";

const cards=[
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Nome 1",
        text: "Aprenda os conceitos básicos com explicações simples em texto, imagem e vídeo."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Nome 2",
        text: "Aprenda os conceitos básicos com explicações simples em texto, imagem e vídeo."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Nome 3",
        text: "Aprenda os conceitos básicos com explicações simples em texto, imagem e vídeo."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Nome 4",
        text: "Aprenda os conceitos básicos com explicações simples em texto, imagem e vídeo."
    }
];

function Comunidade(){
    useEffect(() => {
        document.title = "ChaveDigital - Comunidade";
    }, []);

    return (
        <comunidade>
            <Header activePage="community"/>

            <main>
                <div className="component general-width">
                    <h2 className="gold">Comunidades recomendadas</h2>
                    <CardCarousel cards={cards}/>
                    <br/>
                    <h2 className="gold">Dúvidas</h2>
                    
                </div>
            </main>

            <Footer activePage="community"/>
        </comunidade>
    )
}

export default Comunidade