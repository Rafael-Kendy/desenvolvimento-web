import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import zap from "../../components/assets/img/phone-call.png";

function LessonSection({ title, items }) { //titulo e itens
  const navigate = useNavigate();
  const [checked, setChecked] = useState({});

  const toggleCheckbox = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="lesson-box">
      <h2>{title}</h2>
      <ul className="lesson-list">
        {items.map((item, index) => (
          <li key={index}>
            <label
                    className="lesson-item"
                    onClick={(e) => {if (e.target.tagName.toLowerCase() === "input") { // se clicar na caixa não ativa o navigate
                        return; 
                    }
                    navigate(item.href); // caso contrario, navega normal
                    }}
                >
                <span>
                    <strong>{index + 1}.</strong> <span className="blue">{item.label}</span>
                </span>
                    <input
                        type="checkbox"
                        checked={checked[index] || false}
                        onChange={() => toggleCheckbox(index)}
                        />
                    </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Mensagens() {
    useEffect(() => {document.title = "ChaveDigital - Mensagens e chamadas";}, []);
  const sections = [
    {
      title: "Mensagens",
      items: [
        { label: "Aplicativos de mensagem", href: "/topics/internet/pg_rede" },
        { label: "Mensagens", href: "/topics/internet/pg_comofunciona" },
        { label: "Anexos", href: "/topics/internet/pg_paraqueserve" },
      ],
    },
    {
      title: "Chamadas por voz",
      items: [
        { label: "Contatos", href: "/topics/internet/pg_navegadores" },
        { label: "Ligando", href: "/topics/internet/pg_navbusca" },
        { label: "Funções", href: "/topics/internet/pg_chromeedge" },
      ],
    },
    {
      title: "Chamadas por vídeo",
      items: [
        { label: "Webcam (ou entrada de vídeo)", href: "/topics/internet/pg_paginasinternet" },
        { label: "Funções de vídeo e áudio", href: "/topics/internet/pg_sites" },
        { label: "Cuidado com o que mostra", href: "/topics/internet/pg_links" },
      ],
    },
  ];

  return (
    <div>
      <Header activePage="topicos" />
      <main className="center general-width">
        <section className="lesson-title general-width">
          <figure className="lesson-logo">
            <img src={zap} alt="icone-internet" />
          </figure>
          <div className="lesson-text">
            <h1 className="gold">Mensagens</h1>
            <p className="subtitle">Conversando com alguém longe de você.</p>
            <p className="subsubtitle dark-gray">
              Clique no tópico para ir até a lição. Lugar errado?{" "}
              <Link to="/topicos" className="blue bold">
                Clique aqui para voltar.
              </Link>
            </p>
          </div>
        </section>

        {sections.map((section, idx) => (
          <LessonSection key={idx} title={section.title} items={section.items} />
        ))}

        <section className="lesson-box">
          <ul className="lesson-list">
            <li>
              <label onClick={() => (window.location.href = "/computadores")}>
                <span>
                  <span className="blue">Próxima etapa</span>
                </span>
              </label>
            </li>
          </ul>
        </section>
      </main>
      <Footer activePage="topicos" />
    </div>
  );
}