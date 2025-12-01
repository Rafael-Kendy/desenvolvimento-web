import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import api from "../../components/api"; // Certifique-se de importar sua api configurada

import Header from "../../components/header";
import Footer from "../../components/footer";

// todos os icones de curso
import internetIcon from "../../components/assets/img/internet.png";
import pc from "../../components/assets/img/computer-desktop.png";
import zap from "../../components/assets/img/phone-call.png";

const iconMap ={ // pros icones locais fixos, caso queira adicionar mais, é só por aqui
    "internet.png": internetIcon,
    "computer-desktop.png": pc,
    "phone-call.png": zap,
}

// recebe 'userProgress' pra ler o progresso do user e 'onProgressChange' pra salvar
function LessonSection({ title, items, userProgress, onProgressChange }) {
    const navigate = useNavigate();
    // o useState é inicializado vazio
    const [checked, setChecked] = useState({});

    // esse useEffect "lê" o progresso vindo do userProgress e pré-marca as checkboxes qnd a pagina carrega
    useEffect(() => {
        const initialCheckedState = {};
        if (userProgress && items) {
            items.forEach(item => {
                if (userProgress.includes(item.id)) {
                    initialCheckedState[item.id] = true; // se o ID da lição estiver na lista userProgress marca como true
                }
            });
        }
        setChecked(initialCheckedState);
    }, [userProgress, items]); // roda sempre que o progresso (q vem da API) muda


    // 'toggleCheckbox', o PUT, chama 'onProgressChange'
    const toggleCheckbox = async (lessonId) => {
        
        const isCurrentlyChecked = checked[lessonId] || false;
        const newCheckedState = !isCurrentlyChecked;

        // atualiza a UI localmente pra mudar rápido ao invés de esperar a resposta
        setChecked((prev) => ({...prev, [lessonId]: newCheckedState}));
        // avisa o componente "pai" (CoursePage) que o progresso mudou
        // isto permite que o estado 'userProgress' no pai seja atualizado
        onProgressChange(lessonId, newCheckedState);

        // salva no backend
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Não é possível salvar o progresso: Utilizador não logado.");
                return;
            }

            await api.put( // agora faz pela API
                `/progresso/${lessonId}`,
                { completado: newCheckedState },
                { headers: { Authorization: `Bearer ${token}` } }
            );

        } catch (err) {
            console.error("Falha ao salvar progresso no backend:", err);
            
            // reverte a UI se a API não fizer o que deve fazer
            setChecked((prev) => ({...prev,[lessonId]: isCurrentlyChecked,}));
            onProgressChange(lessonId, isCurrentlyChecked); // reverte no "pai" tb

            // lida com falta de permissão ou caso nao esteja logado (ou não tiver permissão)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("A sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.");
                navigate("/login");
            } else if (err.response) {
                alert(`Erro ao salvar: ${err.response.data.detail || 'Erro desconhecido'}`);
            } else {// outro tipo de erro
                alert("Erro de rede ao salvar o progresso. Verifique sua conexão.");
            }
        }
    };

    return (
        <section className="lesson-box">
        <h2>{title}</h2>
            <ul className="lesson-list">
                {items.map((item, index) => (
                <li key={item.id}> {/* usa item.id da API*/}
                    <label
                        className="lesson-item"
                        onClick={(e) => {
                            if (e.target.tagName.toLowerCase() === "input") {return;}
                            navigate(`/aula/${item.id}`);// navega pra lição ao clicar no label, mas não no checkbox
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <span>
                            <strong>{index + 1}.</strong> <span className="blue\">{item.title}</span>
                        </span>
                        
                        <input
                            type="checkbox"
                            checked={checked[item.id] || false} // le do estado
                            onChange={() => toggleCheckbox(item.id)} // chama o PUT
                        />
                    </label>
                </li>
            ))}
        </ul>
        </section>
    );
}


function CoursePage() {
    
    const { id: courseId } = useParams();
    const navigate = useNavigate();

    // estados separados para os dados
    const [courseData, setCourseData] = useState(null); // p os detalhes do curso
    const [userProgress, setUserProgress] = useState([]); // para os IDs
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // tratar imagens (URL externa ou arquivo local)
    const getCourseImage = (imageName) => {
        if (!imageName) return internetIcon; // padrão
        if (imageName.startsWith("http")) return imageName; // URL 
        return iconMap[imageName] || internetIcon; // local ou padrão
    };

    // o 'useEffect' faz chamadas à API
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                // usa 'Promise.all' para buscar os dois dados em paralelo
                const [courseResponse, progressResponse] = await Promise.all([
                    //NOVO - pega o token e faz as chamadas com API
                    api.get(`/cursos/${courseId}`, headers),
                    // se não tiver token, falha
                    token ? api.get(`/progresso/curso/${courseId}`, headers) : Promise.resolve({ data: [] })
                ]);

                const course = courseResponse.data;

                // VERIFICA SE É PREMIUM!
                if (course.id === 3) { // curso premium tem id 3
                    const premiumStored = localStorage.getItem("is_premium");
                    const isPremium = premiumStored === "true"; // Só é true se estiver escrito "true"
                    
                    if (!isPremium) {
                        setError("Este curso é exclusivo para assinantes Premium.");
                        setLoading(false);
                        return; // N SALVA OS DADOS NEM MOSTRA A TELA
                    }
                }

                // salva os dados nos estados separados
                setCourseData(courseResponse.data); // salva o curso
                setUserProgress(progressResponse.data); // salva o progresso 
                
                document.title = `ChaveDigital - ${courseResponse.data.title}`;

            } catch (err) {// o catch pros diferentes erros
                console.error("Erro no fetch!", err);
                if (err.response) {
                    if (err.response.status === 401) {
                        setError("Sua sessão expirou. Por favor, faça login novamente.");
                        setTimeout(() => navigate("/login"), 2000);
                    } else if (err.response.status === 403) {
                        setError("Você não tem permissão para acessar este curso. Requer assinatura premium.");
                    } else if (err.response.status === 404) {
                        setError("Curso não encontrado.");
                    } else {
                        setError("Erro ao carregar o curso.");
                    }
                } else {
                    setError("Erro de rede ou CORS.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();

    }, [courseId, navigate]);
    
    //  essa função atualiza o estado 'userProgress' no "pai"
    //  quando a 'LessonSection', q é o "filho", chama.
    const handleProgressChange = (lessonId, isCompleted) => {
        setUserProgress(prevProgress => {
            const newProgress = new Set(prevProgress);
            if (isCompleted) {
                newProgress.add(lessonId);
            } else {
                newProgress.delete(lessonId);
            }
            return Array.from(newProgress);
        });
    };

    // renderização condicional
    if (loading) { // enquanto estiver carregando, tal qual topicos.jsx
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width hero">
                    <h1>Carregando curso...</h1>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }
    // no caso de erro, é a mensagem exibida antes da exceção em si
    if (error) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width hero">
                    <h1 className="gold">Erro</h1>
                    <p className="subtitle dark-gray">{error}</p>
                    <button onClick={() => navigate("/login")} className="btn-padrao">Ir para Login</button>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }
    
    // caso nao de erro mas algo de errado (?)
    if (!courseData) return null; 

    // renderiza com sucesso
    return (
        <div>
        <Header activePage="topicos" />
        <main className="center">
            <section className="general-width hero-lesson">
            <figure className="lesson-icon">
                {courseData && ( //só renderiza a img depois que courseData é carregado pela API
                    <img 
                        // 'courseData.image' ("internet.png") pra procurar no 'iconMap' o ícone correto certo (internetIcon, nesse caso)
                        //src={iconMap[courseData.image]} ANTIGO
                        // dinamico agora
                        src={getCourseImage(courseData.image)} // NOVO
                        alt={`Ícone do curso ${courseData.title}`} 
                    />
                )}
            </figure>
            <div className="lesson-text">
                <h1 className="gold">{courseData.title}</h1>
                <p className="subtitle">{courseData.description}</p>
                <p className="subsubtitle dark-gray">
                Clique no tópico para ir até a lição. Lugar errado?{" "}
                <Link to="/topicos" className="blue bold">
                    Clique aqui para voltar.
                </Link>
                </p>
            </div>
            </section>

            {/* mapeamento das seções agora usando lessons, o nome certo*/}
            {courseData.sections && courseData.sections.map((section, idx) => (
                <LessonSection
                    key={idx} 
                    title={section.title}
                    items={section.lessons}
                    userProgress={userProgress} // passa o progresso
                    onProgressChange={handleProgressChange} // Passa a função
                />
            ))}

            {/* botão de voltar aos topico */}
            <section className="lesson-box">
            <ul className="lesson-list">
                <li>
                    <label onClick={() => navigate("/topicos")} style={{cursor: "pointer"}}> {/* navega pra /topicos */}
                        <span>
                            <span className="blue\">Voltar aos tópicos</span>
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

export default CoursePage;

