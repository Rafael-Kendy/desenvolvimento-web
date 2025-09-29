import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from '../components/footer'
import interwebs from "../components/assets/img/internet.png";
import computers from "../components/assets/img/computer-desktop.png";
import zap from "../components/assets/img/phone-call.png";
import zaupa from "../components/assets/img/zaupa.png";
import TopicCard from "../components/topic-card";
import MiniCard from "../components/mini-card";

// Array de tópicos para renderizar dinamicamente

const topicos_cards=[
    {
        img: interwebs,
        alt: "Livros empilhados",
        title: "Internet",
        text: "Conceitos de navegação e sites",
        link:"/internet",
        subtopics: [
            { img: zaupa, alt: "Tutorial", title: "O que é a Internet", text: "Funcionamento básico da internet" },
            { img: zaupa, alt: "Navegadores", title: "Navegadores", text: "Navegando pelo mundo digital" },
            { img: zaupa, alt: "Sites", title: "Sites e links", text: "Endereços digitais" },
            { img: zaupa, alt: "Segurança", title: "Segurança básica", text: "Como se cuidar na rede" },
        ],
    },
    {
        img: computers,
        alt: "Computador",
        title: "Computadores",
        text: "Como computadores funcionam",
        link:"/computadores",
        subtopics: [
            { img: zaupa, alt: "PC", title: "Desligar, hibernar, reiniciar", text: "Como desligar o computador corretamente" },
            { img: zaupa, alt: "SO", title: "Sistema operacional", text: "Windows, Linux, MAC?" },
            { img: zaupa, alt: "Firewall", title: "Firewall e antivírus", text: "Protetores do computador" },
            { img: zaupa, alt: "Atalhos", title: "Atalhos do teclado", text: "Navegando mais rápido" },
    ],
    },
    {
        img: zap,
        alt: "Telefone",
        title: "Mensagens",
        text: "Enviar mensagens e realizar chamadas de vídeo",
        link:"/mensagens",
         subtopics: [
            { img: zaupa, alt: "Chat", title: "Mensagens", text: "Conversas de texto" },
            { img: zaupa, alt: "Voz", title: "Chamadas por voz", text: "Os novos telefones" },
            { img: zaupa, alt: "Vídeo", title: "Chamadas por vídeo", text: "Converse cara a cara" },
        ],
    },
];

function Topicos() {
    useEffect(() => {
        document.title = "ChaveDigital - Tópicos";
    }, []);

  return (
    <div>
      <Header activePage="topics" />
      <main className="center">
        <div className="general-width hero">
          <h1>Todos os tópicos disponíveis</h1>
          <p className="subtitle dark-gray">
            Explore os conteúdos, organizados em categorias.<br />
          </p>
        </div>

        <div className="general-width lessons">
          <div className="cards-large">
            {topicos_cards.map((item, index) => (
              <TopicCard
                key={index}
                img={item.img}
                alt={item.alt}
                title={item.title}
                text={item.text}
                subtopics={item.subtopics}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer activePage="topicos" />
    </div>
  );
}

export default Topicos;