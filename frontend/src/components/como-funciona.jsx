import booksImg from "./assets/img/books.png";
import studyImg from "./assets/img/study.png";
import chatImg from "./assets/img/chat.png";
import MediumCards from "./medium-cards.jsx"

const cards=[
    {
        img: booksImg,
        alt: "Livros empilhados",
        title: "Teoria",
        text: "Aprenda os conceitos básicos com explicações simples em texto, imagem e vídeo."
    },
    {
        img: studyImg,
        alt: "Pessoa estudando",
        title: "Prática",
        text: "Treine no seu ritmo com exercícios interativos dentro da plataforma."
    },
    {
        img: chatImg,
        alt: "Balões de diálogo",
        title: "Feedback",
        text: "Acompanhe seu progresso e receba dicas para avançar com segurança."
    }
];

function ComoFunc(){
    return(
        <comofunc className="center">
            <div className="component general-width lessons">
                <h2>Como funciona</h2>
                <p>Nossa plataforma ajuda você a aprender a usar o computador e a internet de forma simples e acessível. As lições trazem textos, imagens, vídeos e exercícios práticos. Todo o conteúdo é gratuito e colaborativo, sempre em constante evolução.</p>

                <div className="cards">
                    <MediumCards content={cards} />
                </div>
            </div>
        </comofunc>
    );
}

export default ComoFunc