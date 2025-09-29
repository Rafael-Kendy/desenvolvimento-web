import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import internetIcon from "../../components/assets/img/internet.png";


function LessonSection({ title, items }) { // recebe o titulo e os itens
    const navigate = useNavigate();
    const [checked, setChecked] = useState({});
    // sectionKey p/ manter o estado da checkbox?
    // com 
    const toggleCheckbox = (index) => {setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
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

export default function Internet() {
    useEffect(() => {document.title = "ChaveDigital - Internet";}, []);
    const sections = [
        {
        title: "O que é a internet",
        items: [
            { label: "A rede", href: "/lista_topicos/lessons/pg_rede" },
            { label: "Como funciona", href: "/lista_topicos/lessons/pg_comofunciona" },
            { label: "Para que serve", href: "/lista_topicos/lessons/pg_paraqueserve" },
            ],
        },
        {
        title: "Navegadores",
        items: [
            { label: "O que são navegadores?", href: "/lista_topicos/lessons/" },
            { label: "Navegadores e motores de busca", href: "/lista_topicos/lessons/" },
            { label: "Google Chrome e Microsoft Edge", href: "/lista_topicos/lessons/" },
            ],
        },
        {
        title: "Sites e links",
        items: [
            { label: "Páginas da internet", href: "/lista_topicos/lessons/" },
            { label: "Sites", href: "/lista_topicos/lessons/" },
            { label: "Links", href: "/lista_topicos/lessons/" },
            ],
        },
        {
        title: "Segurança digital básica",
        items: [
            { label: "Senhas seguras", href: "/lista_topicos/lessons/" },
            { label: "Links desconhecidos", href: "/lista_topicos/lessons/" },
            ],
        },
    ];

    return (
        <div>
        <Header activePage="topicos" />
        <main className="center general-width">
            <section className="lesson-title general-width">
            <figure className="lesson-logo">
                <img src={internetIcon} alt="icone-internet" />
            </figure>
            <div className="lesson-text">
                <h1 className="gold">Internet</h1>
                <p className="subtitle">Aprenda o que é internet e como navegar.</p>
                <p className="subsubtitle dark-gray">
                Clique no tópico para ir até a lição. Lugar errado?{" "}
                <Link to="/topicos" className="blue bold">
                    Clique aqui para voltar.
                </Link>
                </p>
            </div>
            </section>

            {sections.map((section, idx) => (
                <LessonSection 
                    key={idx} 
                    title={section.title}
                    items={section.items} 
                />
            ))}

            <section className="lesson-box">
            <ul className="lesson-list">
                <li>
                <label onClick={() => (window.location.href = "/lista_topicos/computadores")}>
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