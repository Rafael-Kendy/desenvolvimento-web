import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

import Header from "../../components/header";
import Footer from "../../components/footer";
import internetIcon from "../../components/assets/img/internet.png";

// componente react que representa uma seção de lição com título e itens
function LessonSection({ title, items }) { // usa "destructuring" para pegar as propriedades
    const navigate = useNavigate();

    //ainda ta estatico
    const [checked, setChecked] = useState({});
    // sectionKey p/ manter o estado da checkbox?
    // com storage
    const toggleCheckbox = (lessonId) => { // usa o ID da lição pela API
      setChecked((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
      
    //  saveProgress(lessonId, !checked[lessonId]); ?????????
    };
    
    return (
        <section className="lesson-box">
        <h2>{title}</h2>
            <ul className="lesson-list">
                {items.map((item, index) => ( // item = {id, label, href}
                <li key={item.id}> {/* item.id da API como key */}
                    <label
                    className="lesson-item"
                    onClick={(e) => {if (e.target.tagName.toLowerCase() === "input") { 
                        return; 
                    }
                    navigate(item.href); // item.href da API
                    }}
                >
                <span>
                    <strong>{index + 1}.</strong> <span className="blue\">{item.label}</span> {/* item.label da API */}
                </span>
                <input
                    type="checkbox"
                    checked={checked[item.id] || false} // 'checked' agora é ligado ao ID da lição
                    onChange={() => toggleCheckbox(item.id)} // ID da lição no toggle
                />
                </label>
            </li>
            ))}
        </ul>
        </section>
    );
}

export default function Internet() {

    // pega o ID do curso pela URL (/cursos/1 -> id = 1)
    const { id: courseId } = useParams(); // hook pro react router

    // estados para os dados, loading e erro igual ao topicos.jsx anteriormente
    const [courseData, setCourseData] = useState(null); // armazena o curso com seções
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // a async p/ buscar os dados, depois executa instantaneamente
        const fetchCourse = async () => {
            try {// esse try catch é razoavelmente semelhante ao que está em topicos.jsx, então não vou repetir tudo
                const token = localStorage.getItem("token");

                // PARTE DA AUTENTICAÇÃO!
                if (!token) {
                    setError("Você precisa estar logado para ver este curso.");
                    setLoading(false);
                    setTimeout(() => navigate("/login"), 5000); // redireciona p login
                    return;
                }

                // chamada pra API dar fetch pro curso especifico
                const response = await axios.get(
                    `http://localhost:8000/cursos/${courseId}`, // ID da URL...
                    {
                        headers: { Authorization: `Bearer ${token}` } // manda o token, igual topicos
                    }
                );
                
                // deu certo:
                setCourseData(response.data);
                // atualiza o título da página c o nome do curso vindo da API
                document.title = `ChaveDigital - ${response.data.title}`; 

            } catch (err) {
                // erros tratados (autenticação e autorização)
                if (err.response) {
                    if (err.response.status === 401) {
                        // AUTENTICAÇÃO
                        setError("Sua sessão expirou. Por favor, faça login novamente.");
                        setTimeout(() => navigate("/login"), 5000);
                    
                    } else if (err.response.status === 403) {
                        // AUTORIZAÇÃO 
                        setError("Você não tem permissão para acessar este curso! Requer assinatura premium.");
                    
                    } else if (err.response.status === 404) {
                        setError("Curso não encontrado.");
                    } else {
                        setError("Erro ao carregar o curso.");
                    }
                } else {
                    setError("Erro de rede ao tentar buscar o curso.");
                }
            } finally {
                setLoading(false); //loading false
            }
        };

        fetchCourse();// executa a async

    }, [courseId, navigate]); // roda o efeito qnd id do curso na URL muda
//useEffect 

/* antigo - estático
    const sections = [ // array de seções pra renderizar mais dinamicamente
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
*/
// lidando com uns casos possíveis
    if (loading) { // mesma ideia de topicos.jsx, carregamento provisório
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

    if (error) {
        return (
            <div>
                <Header activePage="topicos" />
                <main className="center general-width hero">
                    <h1 className="gold">Erro ao carregar</h1>
                    <p className="subtitle dark-gray">{error}</p>
                    <Link to="/topicos" className="blue bold">
                        Clique aqui para voltar aos tópicos.
                    </Link>
                </main>
                <Footer activePage="topicos" />
            </div>
        );
    }
    
    if (!courseData) {
        return null; // n tem erro, mas os dados ainda não chegaram
    }
    // SUCESSO - renderiza a pag
    return (
        <div>
        <Header activePage="topicos" />
        <main className="center">
            <section className="general-width hero-lesson">
            <figure className="lesson-icon">
                <img src={internetIcon} alt="Ícone do curso" />
            </figure>
            <div className="lesson-text">
                {/* dados vem da API dinamicamente! */}
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

            {/* 18. Mapeia as seções vindas da API */}
            {courseData.sections.map((section, idx) => ( 
                <LessonSection
                    key={idx} // key aqui pode ser o índice
                    title={section.title} // da API
                    items={section.items}   // da API
                />
            ))}

            <section className="lesson-box">
            <ul className="lesson-list">
                <li>
                    {/* link estático, sempre volta p mesma dessa parte do fluxo */}
                    <label onClick={() => navigate("/topicos")}>
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

    //antigo...
    /*
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

            {sections.map((section, idx) => ( // método do js pra percorrer o array
                <LessonSection                // executando (section,idx) => ( ... ) para cada seção
                    key={idx} 
                    title={section.title}
                    items={section.items} 
                />                            // o react renderiza um LessonSection p cada
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
        
    );*/
    

}