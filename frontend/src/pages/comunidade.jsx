import { useEffect } from "react";
import { useState } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import DisplayImage from "../components/image";
import CardCarousel from "../components/card-carousel";
import QuestionForm from "../components/question-form";
import api from "../components/api";

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

    const handleFormSubmit = async (data) => {
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("question", data.question);

        if (data.image) {
        formData.append("image", data.image);
        }

        // Send to FastAPI
        const response = await api.post("/comunidade", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        // Add the returned post to your local state
        setPosts([response.data.question, ...posts]);
    } catch (error) {
        console.error("Error posting question:", error);
        alert("Erro ao enviar sua dúvida. Verifique o console para mais detalhes.");
    }
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
                    <hr className="light"/>
                    
                    <h2 className="center">Dúvidas</h2>

                    <h3 className="gold">Tirar dúvida</h3>
                    <QuestionForm onSubmit={handleFormSubmit} />

                    <br/>

                    <h3 className="gold">Dúvidas postadas</h3>
                </div>
            </main>

            <Footer activePage="community"/>
        </comunidade>
    )
}

export default Comunidade