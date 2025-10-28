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

    const handleDeleteLesson = async () => {//DELETE lesson
        // confirma
        if (!window.confirm("Tem certeza que deseja deletar esta lição? Esta ação é irreversível.")) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {// se nao tem o token...
            alert("Você precisa estar logado como admin para fazer isto.");
            return;
        }

        try {
            // chama DELETE com axios
            await axios.delete(
                `http://localhost:8000/licoes/${lessonId}`, // Usa o lessonId da página atual
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Envia o token
                    }
                }
            );

            // se funcionar
            alert("Lição deletada com sucesso.");
            
            // navega o usuário de volta uma página no index
            navigate(-1); 

        } catch (err) {
            // se der falha:
            if (err.response && err.response.status === 403) {
                alert("Acesso negado. Apenas administradores podem deletar lições.");
            } else {
                alert("Erro ao deletar a lição.");
            }
            console.error(err);
        }
    };//funcao DELETE

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
                        <img
                            src={lessonContent.header_image_url || webs} // usa a URL da API, ou a imagem estática se precisar
                            alt={`Ícone da lição ${lessonContent.title}`}
                         />
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

                    <div className="lesson-next">
                        <h2>Próximos tópicos</h2>
                        {/* verificamos se lessonContent.next_lessons existe E se tem pelo menos 1 item
                          o 'lessonContent' é o estado que já busco em useEffect*/}
                        {lessonContent.next_lessons && lessonContent.next_lessons.length > 0 ? (
                            // se sim, cria a lista
                            <ul className="list-disc list-inside">
                                {/* .map() pra criar um <li> para cada item que o backend enviou*/}
                                {lessonContent.next_lessons.map((nextLesson) => (
                                    <li key={nextLesson.id}>
                                        <a
                                            href={`/licoes/${nextLesson.id}`}
                                            onClick={(e) => {
                                                // previne que a pagina seja completamente regarregada
                                                e.preventDefault(); 
                                                // usa o navigate do react-router para ir pra próxima lição
                                                navigate(`/licoes/${nextLesson.id}`);
                                            }}
                                            className="blue"
                                        >
                                            {nextLesson.title} {/* título pela API */}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            // se não, fala que concluiu
                            <p style={{margin: '15px 0'}}>
                                Você concluiu este módulo!
                            </p>
                        )}
                         {/* botão p voltar pra a lista de lições do curso */}
                         {/* TODO: voltar pro curso, não pra lista de tópicos */}
                         <button onClick={() => navigate('/topicos')} style={{marginTop: '20px', width: '100%'}}>Voltar para os tópicos</button>
                         {localStorage.getItem("is_premium") === "true" && (
                         <button onClick={handleDeleteLesson} 
                             style={{marginTop: '10px', width: '100%', backgroundColor: 'var(--red)', color: 'var(--white)'}}
                         >
                             Deletar Lição (Apenas admin)
                         </button>
                     )}
                    </div>
                </aside>
            </main>

            <Footer activePage="topicos" />
        </div>
    );
}
