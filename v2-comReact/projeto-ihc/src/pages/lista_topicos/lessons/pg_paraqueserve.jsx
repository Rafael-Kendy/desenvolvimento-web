import Header from "../../../components/header";
import Footer from "../../../components/footer";
import webs from "../../../components/assets/img/internet.png";
import zaupa from "../../../components/assets/img/zaupa.png";
import { useEffect } from "react";

export default function PgParaQueServe() {
    useEffect(() => {document.title = "ChaveDigital - Para que serve";}, []);
    const nextTopics = [
    { label: "Fim do subtópico! Clique aqui para voltar.", href: "/lista_topicos/internet" },
  ];

  return (
    <div>
      <Header activePage="topicos" />

      <main className="general-width lesson-layout">
        {/* Coluna esquerda */}
        <section className="lesson-content">
          <div className="lesson-header">
            <img src={webs} alt="Ícone da Internet" />
            <h1 className="gold">Para que serve</h1>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 1" />
            <p>Isso tudo aqui</p>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 2" />
            <p> é placeholder </p>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 3" />
            <p> que vamos encher depois.</p>
          </div>
        </section>

        {/* Coluna direita */}
        <aside className="lesson-sidebar">
          <div className="lesson-video">
            <h2>Vídeo da lição</h2>
            <video controls>
              <source src="/videos/rede.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </div>

          <div className="lesson-next">
            <h2>Próximos tópicos</h2>
            <ul className="list-disc list-inside">
              {nextTopics.map((topic, idx) => (
                <li key={idx}>
                  <a href={topic.href} className="blue">
                    {topic.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <Footer activePage="topicos" />
    </div>
  );
}