import { useEffect } from "react";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import webs from "../../../components/assets/img/internet.png";
import zaupa from "../../../components/assets/img/zaupa.png";

export default function PgRede() {
    useEffect(() => {document.title = "ChaveDigital - A rede";}, []);
    const nextTopics = [
        { label: "Como funciona", href: "/lista_topicos/lessons/pg_comofunciona" },
        { label: "Para que serve", href: "/lista_topicos/lessons/pg_paraqueserve" },
  ];

  return (
    <div>
      <Header activePage="topicos" />

      <main className="general-width lesson-layout">
        {/* Coluna esquerda */}
        <section className="lesson-content">
          <div className="lesson-header">
            <img src={webs} alt="Ícone da Internet" />
            <h1 className="gold">A rede</h1>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 1" />
            <p>Pla</p>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 2" />
            <p>ce</p>
          </div>

          <div className="lesson-step">
            <img src={zaupa} alt="Passo 3" />
            <p>holder.</p>
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