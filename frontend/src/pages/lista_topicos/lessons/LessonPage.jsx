import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../components/api"; 

import Header from "../../../components/header";
import Footer from "../../../components/footer";

// imgs locais
import internetImg from "../../../components/assets/img/internet.png";
import pcImg from "../../../components/assets/img/computer-desktop.png";
import zapImg from "../../../components/assets/img/phone-call.png";
import zaupaImg from "../../../components/assets/img/zaupa.png"; 

// mapa de imgs
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

    // imagem hibrida igual coursepage
    const getHeaderImage = (imgString) => {
        if (!imgString) return internetImg;
        if (imgString.startsWith("http")) return imgString;
        return lessonImageMap[imgString] || internetImg;
    };

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                // força o scroll pro inicio
                window.scrollTo(0, 0);

                const token = localStorage.getItem("token");
                const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                const response = await api.get(`/licoes/${lessonId}`, headers);
                setLessonContent(response.data);
                document.title = `ChaveDigital - ${response.data.title}`;

            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                    setError("Esta lição é exclusiva para assinantes Premium.");
                } else if (err.response?.status === 404) {
                    setError("Lição não encontrada.");
                } else {
                    setError("Erro ao carregar a lição.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]); // recarrega se mudar ID

    const handleDeleteLesson = async () => {
        if (!window.confirm("ATENÇÃO: Tem certeza que deseja deletar esta lição?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await api.delete(`/licoes/${lessonId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Lição deletada!");
            navigate("/topicos");
        } catch (err) {
            alert("Erro ao deletar (Permissão negada).");
        }
    };

    // renderização condicional

    if (loading) {
        return (
            <div className="page-container">
                <Header activePage="topicos" />
                <main className="center general-width hero" style={{minHeight: '60vh'}}>
                    <h2 className="loading-text">Carregando conteúdo...</h2>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <Header activePage="topicos" />
                <main className="center general-width hero" style={{minHeight: '60vh', textAlign: 'center'}}>
                    <h1 className="gold">Ops!</h1>
                    <p className="subtitle dark-gray" style={{marginBottom: '20px'}}>{error}</p>
                    <button onClick={() => navigate('/topicos')} className="btn-padrao">
                        Voltar aos Tópicos
                    </button>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }

    if (!lessonContent) return null;

    // tem próxima lição? -> o backend manda uma lista, pegamos a primeira
    const nextLesson = lessonContent.next_lessons && lessonContent.next_lessons.length > 0 
        ? lessonContent.next_lessons[0] 
        : null;

    return (
        <div className="page-container">
            <Header activePage="topicos" />
            
            <main className="center">
                
                {/* header da lição */}
                <section className="general-width hero-lesson">
                    <figure className="lesson-icon">
                        <img 
                            src={getHeaderImage(lessonContent.header_image_url)} 
                            alt="Ícone do Tópico"
                            style={{ objectFit: 'contain', maxHeight: '150px' }} // ajusta a imagem dentro do espaço
                        />
                    </figure>
                    <div className="lesson-text">
                        <h1 className="gold">{lessonContent.title}</h1>
                        <p className="subtitle">Módulo de Aprendizado</p>
                    </div>
                </section>

                {/* --- CONTEÚDO PRINCIPAL --- */}
                <section className="general-width" style={{ marginTop: '20px', marginBottom: '50px' }}>
                    
                    {/* 1. VÍDEO */}
                    <div className="lesson-content-box" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        {lessonContent.video_url ? (
                            <div className="video-wrapper" style={{ marginBottom: '30px' }}>
                                <video 
                                    controls 
                                    className="lesson-video" 
                                    style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', backgroundColor: '#000' }}
                                >
                                    <source src={lessonContent.video_url} type="video/mp4" />
                                    Seu navegador não suporta o player de vídeo.
                                </video>
                            </div>
                        ) : (
                            <div className="video-placeholder" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '30px' }}>
                                <p className="dark-gray">Esta lição é baseada em leitura. Siga os passos abaixo.</p>
                            </div>
                        )}

                        {/* 2. PASSOS (TEXTO) */}
                        <div className="steps-container">
                            <h2 className="blue" style={{ marginBottom: '20px' }}>O que vamos aprender:</h2>
                            
                            {lessonContent.steps && lessonContent.steps.length > 0 ? (
                                <ul className="steps-list" style={{ listStyle: 'none', padding: 0 }}>
                                    {lessonContent.steps.map((step, index) => (
                                        <li key={index} className="step-item" style={{ display: 'flex', marginBottom: '15px', alignItems: 'flex-start' }}>
                                            <span style={{ 
                                                backgroundColor: 'var(--blue)', 
                                                color: 'white', 
                                                width: '30px', 
                                                height: '30px', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                justifyContent: 'center', 
                                                alignItems: 'center',
                                                marginRight: '15px',
                                                flexShrink: 0,
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </span>
                                            <p style={{ marginTop: '4px', fontSize: '1.1rem', lineHeight: '1.5' }}>
                                                {step.text}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Conteúdo em texto indisponível no momento.</p>
                            )}
                        </div>
                    </div>

                    {/* 3. NAVEGAÇÃO E BOTÕES */}
                    <div className="navigation-buttons" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Se tiver próxima lição, mostra o botão de avançar */}
                        {nextLesson ? (
                            <button 
                                onClick={() => navigate(`/aula/${nextLesson.id}`)}
                                className="btn-padrao"
                                style={{ width: '100%', textAlign: 'center', padding: '15px', fontSize: '1.1rem' }}
                            >
                                Próxima Lição: {nextLesson.title} →
                            </button>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e6fffa', borderRadius: '8px', color: '#047857' }}>
                                <strong>Parabéns!</strong> Você concluiu todas as lições desta seção.
                            </div>
                        )}

                        <button 
                            onClick={() => navigate('/topicos')} 
                            style={{ 
                                background: 'transparent', 
                                border: '2px solid var(--blue)', 
                                color: 'var(--blue)', 
                                padding: '10px', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Voltar para os Tópicos
                        </button>

                        {/* Botão Admin */}
                        {localStorage.getItem("is_premium") === "true" && (
                            <button 
                                onClick={handleDeleteLesson} 
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
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