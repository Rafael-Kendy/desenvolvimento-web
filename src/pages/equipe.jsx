import { useEffect } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import TextoGeral from '../components/texto-geral'
import ImagLado from "../components/imagens-lateral";

import hugo from "../components/assets/img/hugo.png";
import kendy from "../components/assets/img/kendy.png";
import zaupa from "../components/assets/img/zaupa.png";

function Equipe(){
    useEffect(() => {
        document.title = "ChaveDigital - Equipe";
    }, []);

    const texts=[
        {
        index: 0,
        type: "justify",
        title: "Nossa equipe",
        content:[
            {txt: "Nosso projeto é fruto da colaboração de 3 estudantes. Cada integrante contribuiu com ideias, pesquisas e desenvolvimento para tornar a alfabetização digital acessível a todos. Acreditamos que o aprendizado é mais rico quando construído em conjunto, e por isso nossa equipe cresce e se fortalece com a participação de cada colaborador."},
        ]
        }
    ];
    const cont=[
        {
        src: hugo,
        alt: "Hugo",
        title: "Hugo Amassado",
        txt: "Um mano."
        },
        {
        src: kendy,
        alt: "Kendy",
        title: "Rafael Kendy",
        txt: "Dois mano."
        },
        {
        src: zaupa,
        alt: "Zaupa",
        title: "Rafael Zaupa",
        txt: "Três mano."
        },
    ];
    
    return (
        <equipe className="general-width">
            <Header activePage="team"/>
            <main>
                <TextoGeral texts={texts}/>
                <ImagLado content={cont}/>
                <div className="general-width">
                    <p className="guidelines">Agradecemos de coração a todas as pessoas que contribuíram de alguma forma para este projeto, mesmo que seus nomes não estejam citados diretamente aqui. Cada sugestão, apoio ou colaboração fez a diferença e ajudou a tornar esta plataforma possível.</p>
                </div>
            </main>
            <Footer activePage="team"/>
        </equipe>
    );
}

export default Equipe