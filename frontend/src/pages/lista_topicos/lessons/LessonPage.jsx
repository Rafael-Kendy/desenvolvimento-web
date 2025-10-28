import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import webs from "../../../components/assets/img/internet.png"; // pode ser dinamicamente mudado
import zaupa from "../../../components/assets/img/zaupa.png"; // pode ser dinamicamente mudado

// Várias lógicas são reutilizadas de .jsx que vêm antes no flow do site. Não recomentei a mesma coisa em todos.
export default function LessonPage() {
    // pega o ID da lição a partir da URL
    const { lessonId } = useParams();
    const navigate = useNavigate();

    // estados para guardar os dados, carregamento e erro (tudo igual ao resto dos .jsx)
    const [lessonContent, setLessonContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect para buscar os dados da API quando a pag carrega
    useEffect(() => {
        const fetchLessonContent = async () => {
            setLoading(true); 
            setError(null); // limpa erros anteriores!

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Você precisa estar logado para ver esta lição.");
                    setLoading(false);
                    setTimeout(() => navigate("/login"), 5000);
                    return;
                }

                // endpoint GET /licoes/{id}
                const response = await axios.get(
                    `http://localhost:8000/licoes/${lessonId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // se sucesso, guarda os dados
                setLessonContent(response.data);
                document.title = `ChaveDigital - ${response.data.title}`; // att titulo da pag

            } catch (err) {// o de sempre né
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError("Sua sessão expirou ou você não tem permissão para acessar essa lição.");
                        setTimeout(() => navigate("/login"), 5000);
                    } else if (err.response.status === 404) {
                        setError("Lição não encontrada.");
                    } else {
                        setError(`Erro ao carregar a lição: ${err.response.data.detail || 'Erro desconhecido'}`);
                    }
                } else {
                    setError("Erro de rede ao carregar a lição. Verifique sua conexão.");
                }
            } finally {
                setLoading(false); // carrega com sucesso ou n
            }
        };

        fetchLessonContent();

    }, [lessonId, navigate]); // roda o efeito se o ID da lição mudar

    // parte da renderização condicional
    if (loading) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width hero">
                    <h1>Carregando lição...</h1>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width hero">
                    <h1 className="gold">Erro</h1>
                    <p className="subtitle dark-gray">{error}</p>
                    {/* Botão opcional para voltar */}
                    <button onClick={() => navigate(-1)} style={{marginTop: '20px'}}>Voltar</button>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (!lessonContent) {
        return null; 
    }

    return (
        <div>
            <Header activePage="topicos" />

            <main className="general-width lesson-layout">
                {/* coluna esquerda - conteúdo tenta ser dinâmico */}
                <section className="lesson-content">
                    <div className="lesson-header">
                        {/* todo: usar um ícone dinâmico da API? */}
                        <img src={webs} alt={`Ícone da lição ${lessonContent.title}`} />
                        <h1 className="gold">{lessonContent.title}</h1> {/* título da API */}
                    </div>

                    {/* mapeia os steps da API */}
                    {lessonContent.steps.map((step, index) => (
                        <div className="lesson-step" key={index}>
                            {/* todo: usar uma imagem dinâmica vinda da API? De novo?*/}
                            <img src={zaupa} alt={`Passo ${index + 1}`} />
                            <p>{step.text}</p> {/* texto do step, da API */}
                        </div>
                    ))}
                </section>

                {/* coluna direita - vídeo e próximos (todo: deixar os próximos dinâmicos) */}
                <aside className="lesson-sidebar">
                    {/* renderiza o vídeo só se a API enviar uma URL */}
                    {lessonContent.video_url && (
                        <div className="lesson-video">
                            <h2>Vídeo da lição</h2>
                            {/* TODO: O URL do vídeo precisa ser ajustado ou servido pelo backend... */}
                            <video controls width="100%">
                                <source src={lessonContent.video_url} type="video/mp4" />
                                Seu navegador não suporta vídeo.
                            </video>
                        </div>
                    )}

                    {/* FIXME: A lista de próximos tópicos ainda está estática */}
                    <div className="lesson-next">
                        <h2>Próximos tópicos</h2>
                        <ul className="list-disc list-inside">
                             {/* Idealmente, a API enviaria os próximos hrefs */}
                            <li><a href="#" className="blue">Próxima Lição (FIXME)</a></li>
                        </ul>
                         {/* botão p voltar pra a lista de lições do curso */}
                         <button onClick={() => navigate(-1)} style={{marginTop: '20px', width: '100%'}}>Voltar para o Curso</button>
                    </div>
                </aside>
            </main>

            <Footer activePage="topicos" />
        </div>
    );
}
