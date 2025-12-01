import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../components/api"; 

import Header from "../../../components/header";
import Footer from "../../../components/footer";

// 1. IMAGENS LOCAIS
import internetImg from "../../../components/assets/img/internet.png";
import pcImg from "../../../components/assets/img/computer-desktop.png";
import zapImg from "../../../components/assets/img/phone-call.png";
import zaupaImg from "../../../components/assets/img/zaupa.png"; 

// 2. MAPA DE IMAGENS
const lessonImageMap = {
    "internet.png": internetImg,
    "computer-desktop.png": pcImg,
    "phone-call.png": zapImg,
    "zaupa.png": zaupaImg,
};

export default function LessonPage() {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lessonContent, setLessonContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // aquela função de imagem híbrida -> pode ser tanto url quanto local
    const getHeaderImage = (imgString) => {
        if (!imgString) return internetImg;// local
        if (imgString.startsWith("http")) return imgString; //url - é string e começa com http
        return lessonImageMap[imgString] || internetImg; // retorna uma das duas
    };

    const renderVideo = (url) => {
        if (!url) return null;

        // link do youtube, comum ou encurtado
        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

        if (isYouTube) {
            // extrai ID do vídeo e transforma em embed
            let embedUrl = url;
            if (url.includes("watch?v=")) {
                const videoId = url.split("watch?v=")[1].split("&")[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes("youtu.be/")) {
                const videoId = url.split("youtu.be/")[1].split("?")[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }

            return (
                <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                    <iframe 
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                </div>
            );
        }

        // se n for youtube, vai de mp4 mesmo
        return (
            <div className="video-wrapper">
                <video controls className="lesson-video">
                    <source src={url} type="video/mp4" />
                    Seu navegador não suporta o player de vídeo.
                </video>
            </div>
        );
    };

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                window.scrollTo(0, 0); // scroll pro topo da página qnd carrega

                const token = localStorage.getItem("token");
                const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};// se tiver token, manda no header

                const response = await api.get(`/licoes/${lessonId}`, headers);// chamada a API
                setLessonContent(response.data);
                document.title = `ChaveDigital - ${response.data.title}`;

            } catch (err) {// erros tratados
                console.error(err);
                if (err.response?.status === 403) {
                    setError("Esta lição é exclusiva para assinantes Premium.");
                } else if (err.response?.status === 404) {
                    setError("Lição não encontrada.");
                }else if (err.response?.status === 401) {
                    setError("Você não tem permissão para acessar isso. Verifique se está logado.");
                } else {
                    setError("Erro ao carregar a lição.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]); 

    const handleDeleteLesson = async () => {// função de deletar lição (só admin)
        if (!window.confirm("ATENÇÃO: Tem certeza que deseja deletar esta lição? Essa ação não tem volta.")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Erro de sessão. Faça login novamente.");
            navigate("/login");
            return;
        }

        try {
            await api.delete(`/licoes/${lessonId}`, { // chamada a API, novamente. Deleta aa lição com o id correspondente
                headers: { Authorization: `Bearer ${token}` }// manda token no header
            });
            alert("Lição deletada!");
            navigate("/topicos");// volta pra pag de topicos
        } catch (err) { // possiveis exceções
            alert("Erro ao deletar (Permissão negada).");
            if (err.response && err.response.status === 403) {
                alert("Permissão negada: Apenas administradores podem deletar.");
            } else if (err.response && err.response.status === 404) {
                alert("Erro: Essa lição já não existe ou não consta como existente.");
                navigate("/topicos");
            } else {
                alert("Ocorreu um erro ao tentar deletar.");
            }
        }
    };

    // renderizações condicionais

    if (loading) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width state-container">
                    <h2 className="blue">Carregando conteúdo...</h2>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width state-container">
                    <h1 className="gold">Ops!</h1>
                    <p className="subtitle dark-gray">{error}</p>
                    <button onClick={() => navigate('/topicos')} className="btn-padrao">
                        Voltar aos Tópicos
                    </button>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (!lessonContent) return null;

    const nextLesson = lessonContent.next_lessons && lessonContent.next_lessons.length > 0 
        ? lessonContent.next_lessons[0] 
        : null;

    return (
        <div>
            <Header activePage="topicos" />
            
            <main className="center">
                
                {/* --- CABEÇALHO DA LIÇÃO (HERO) --- */}
                <section className="general-width hero-lesson">
                    <figure className="lesson-icon">
                        <img 
                            src={getHeaderImage(lessonContent.header_image_url)} 
                            alt="Ícone do Tópico"
                            className="lesson-hero-img"
                        />
                    </figure>
                    <div className="lesson-text">
                        <h1 className="gold">{lessonContent.title}</h1>
                        <p className="subtitle">Módulo de Aprendizado</p>
                    </div>
                </section>

                {/* --- CONTEÚDO PRINCIPAL (CARD BRANCO) --- */}
                <section className="general-width">
                    
                    <div className="lesson-content-card">
                        
                        {/* chamando renderVideo pra rodar se for youtube */}
                        {lessonContent.video_url ? (
                            renderVideo(lessonContent.video_url)
                        ) : (
                            <div className="video-placeholder">
                                <p>Esta lição é baseada em leitura e não contém vídeo! Siga abaixo.</p>
                            </div>
                        )}

                        {/* steps da lição (em texto) */}
                        <div className="steps-container">
                            <h2 className="steps-title">Comece a aprender:</h2>
                            
                            {lessonContent.steps && lessonContent.steps.length > 0 ? (
                                <ul className="steps-list">
                                    {lessonContent.steps.map((step, index) => (
                                        <li key={index} className="step-item">
                                            <span className="step-number">
                                                {index + 1}
                                            </span>
                                            <p className="step-text">
                                                {step.text}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="dark-gray">Conteúdo em texto indisponível no momento.</p>
                            )}
                        </div>
                    </div>

                    {/* 3. NAVEGAÇÃO E BOTÕES */}
                    <div className="lesson-nav-container">
                        
                        {nextLesson ? (
                            <button 
                                onClick={() => navigate(`/aula/${nextLesson.id}`)}
                                className="btn-next-lesson"
                            >
                                Próxima Lição: {nextLesson.title} →
                            </button>
                        ) : (
                            <div className="msg-success">
                                <strong>Parabéns!</strong> Você concluiu todas as lições desta seção.
                            </div>
                        )}

                        <button 
                            onClick={() => navigate('/topicos')} 
                            className="btn-back-outline"
                        >
                            Voltar para os Tópicos
                        </button>

                        {/* Botão Admin */}
                        {localStorage.getItem("is_premium") === "true" && (
                            <button 
                                onClick={handleDeleteLesson} 
                                className="btn-delete-red"
                            >
                                🗑️ Deletar Lição (Admin)
                            </button>
                        )}
                    </div>

                </section>
            </main>

            <Footer activePage="topicos" />
        </div>
    );
}