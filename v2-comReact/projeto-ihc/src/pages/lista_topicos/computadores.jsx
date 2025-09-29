import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import pc from "../../components/assets/img/computer-desktop.png";

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
              onClick={() => navigate(item.href)}
              className="cursor-pointer flex items-center gap-2"
            >
              <span>
                <strong>{index + 1}.</strong>{" "}
                <span className="blue">{item.label}</span>
              </span>
              <input
                type="checkbox"
                checked={checked[index] || false}
                onChange={(e) => {
                  e.stopPropagation(); // não dispara o navigate ao clicar na checkbox
                  toggleCheckbox(index);
                }}
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Computadores() {
    useEffect(() => {document.title = "ChaveDigital - Computadores";}, []);
  const sections = [
    {
      title: "Desligar, hibernar, reiniciar",
      items: [
        { label: "Desligar", href: "/topics/internet/pg_rede" },
        { label: "Hibernar", href: "/topics/internet/pg_comofunciona" },
        { label: "Reiniciar", href: "/topics/internet/pg_paraqueserve" },
      ],
    },
    {
      title: "Sistema operacional",
      items: [
        { label: "O que é um sistema operacional", href: "/topics/internet/pg_navegadores" },
        { label: "Qual eu uso?", href: "/topics/internet/pg_navbusca" },
        { label: "Que diferença isso faz?", href: "/topics/internet/pg_chromeedge" },
      ],
    },
    {
      title: "Firewall e antivírus",
      items: [
        { label: "Antivírus", href: "/topics/internet/pg_paginasinternet" },
        { label: "Firewall", href: "/topics/internet/pg_sites" },
        { label: "Boas práticas de uso", href: "/topics/internet/pg_links" },
      ],
    },
    {
      title: "Atalhos do teclado",
      items: [
        { label: "Atalhos universais", href: "/topics/internet/pg_senhas" },
        { label: "Atalhos do teclado", href: "/topics/internet/pg_linksdesconhecidos" },
      ],
    },
  ];

  return (
    <div>
      <Header activePage="topicos" />
      <main className="center general-width">
        <section className="lesson-title general-width">
          <figure className="lesson-logo">
            <img src={pc} alt="icone-computador" />
          </figure>
          <div className="lesson-text">
            <h1 className="gold">Computadores</h1>
            <p className="subtitle">O básico a se saber para utilizar um computador.</p>
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
              <label onClick={() => (window.location.href = "/lista_topicos/mensagens")}>
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