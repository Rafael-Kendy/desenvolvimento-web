import { useEffect } from "react";
import { useState } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import DisplayImage from "../components/image";
import CardCarousel from "../components/card-carousel";
import SimpleForm from "../components/simple-form";

import placeHolder from "../components/assets/img/image.png";

const cards=[
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Facebook",
        text: "Solicitações de amizade, postagens, mensagens e tudo para você."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Whatsapp",
        text: "Mande mensagens e participe de grupos com seus amigos."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Email",
        text: "Aprenda a escrever emails usando qualquer gerenciador."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Arquivos",
        text: "Tire suas dúvidas sobre como guardar arquivos no computador."
    }
];

function Comunidade(){
    useEffect(() => {
        document.title = "ChaveDigital - Comunidade";
    }, []);

  const [posts, setPosts] = useState([]);

    const handleFormSubmit = (data) => {
        const newPost = {
        id: Date.now(),
        name: data.name,
        text: data.text,
        image: data.image ? URL.createObjectURL(data.image) : null,
        };
        setPosts([newPost, ...posts]);
    };

    return (
        <comunidade>
            <Header activePage="community"/>

            <main>
                <div className="component general-width">
                    <h1 className="center">Comunidades</h1>
                    <h2 className="gold">Grupos recomendados</h2>
                    <CardCarousel cards={cards}/>

                    <br/>
                    
                    <h2 className="gold">Dúvidas</h2>
                    <SimpleForm onSubmit={handleFormSubmit} />
                </div>
            </main>

            <Footer activePage="community"/>
        </comunidade>
    )
}

export default Comunidade