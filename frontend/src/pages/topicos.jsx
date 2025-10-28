import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/header";
import Footer from '../components/footer'

//imagens estáticas
import interwebs from "../components/assets/img/internet.png";
import computers from "../components/assets/img/computer-desktop.png";
import zap from "../components/assets/img/phone-call.png";

import TopicCard from "../components/topic-card";
//import zaupa from "../components/assets/img/zaupa.png";
//import MiniCard from "../components/mini-card";


/*
// Array de tópicos para renderizar dinamicamente
const topicos_cards=[
    {
        img: interwebs,
        alt: "Livros empilhados",
        title: "Internet",
        text: "Conceitos de navegação e sites",
        link:"/lista_topicos/internet",
        subtopics: [
            { img: zaupa, alt: "Tutorial", title: "O que é a Internet", text: "Funcionamento básico da internet" },
            { img: zaupa, alt: "Navegadores", title: "Navegadores", text: "Navegando pelo mundo digital" },
            { img: zaupa, alt: "Sites", title: "Sites e links", text: "Endereços digitais" },
            { img: zaupa, alt: "Segurança", title: "Segurança básica", text: "Como se cuidar na rede" },
        ],
    },
    {
        img: computers,
        alt: "Computador",
        title: "Computadores",
        text: "Como computadores funcionam",
        link:"/lista_topicos/computadores",
        subtopics: [
            { img: zaupa, alt: "PC", title: "Desligar, hibernar, reiniciar", text: "Como desligar o computador corretamente" },
            { img: zaupa, alt: "SO", title: "Sistema operacional", text: "Windows, Linux, MAC?" },
            { img: zaupa, alt: "Firewall", title: "Firewall e antivírus", text: "Protetores do computador" },
            { img: zaupa, alt: "Atalhos", title: "Atalhos do teclado", text: "Navegando mais rápido" },
    ],
    },
    {
        img: zap,
        alt: "Telefone",
        title: "Mensagens",
        text: "Enviar mensagens e realizar chamadas de vídeo",
        link:"/lista_topicos/mensagens",
         subtopics: [
            { img: zaupa, alt: "Chat", title: "Mensagens", text: "Conversas de texto" },
            { img: zaupa, alt: "Voz", title: "Chamadas por voz", text: "Os novos telefones" },
            { img: zaupa, alt: "Vídeo", title: "Chamadas por vídeo", text: "Converse cara a cara" },
        ],
    },
];*/

function Topicos() {
  // estados!
  const [topicos, setTopicos] = useState([]); // armazena os cursos e tópicos da API
  const [loading, setLoading] = useState(true); // indica o carregamento
  const [error, setError] = useState(null); // armazena mensagens de erro
  const navigate = useNavigate(); // redireciona o usuário se precisar
  
  const getTopicImage = (id) => {// as imagens são "colocadas" aqui depois da instrução do backend
    switch (id) {
      case 1:
        return interwebs;
      case 2:
        return computers;
      case 3:
        return zap;
      default:
        return interwebs; // Uma imagem padrão
    }
  };//getTopicImage

  //useEffect(() => {document.title = "ChaveDigital - Todos os tópicos";}, []);

  useEffect(() => {
    document.title = "ChaveDigital - Todos os tópicos";
    // função p/ dar fetch nos dados da API
    const fetchTopicos = async() => {
      try {
        // pega o token de autenticação e salva no localStorage
        const token = localStorage.getItem("token");

        // verifica se o usuário ta logado
        if (!token) {// se não,
          setError("Você precisa estar logado para ver os cursos. Redirecionando...");
          setLoading(false);
          // Automaticamente redireciona para a tela de login
          setTimeout(() => navigate("/login"), 5000);
          return;
        }//if token

        // requisição para a API com o token de 1.
        const response = await axios.get("http://localhost:8000/cursos", { //async!!
          headers: {// header de metadados, não header do site (obviamente)
            // Authorization -> está autenticado
            Authorization: `Bearer ${token}` // envia o token para o backend (var JS)
          }
        });

        //salva os dados no estado, loading = false
        setTopicos(response.data);
        setLoading(false);

      } catch (err) {
        // catch de possíveis erros
        if (err.response && err.response.status === 401) {
          // nao autorizado
          setError("Sua sessão expirou. Por favor, faça login novamente.");
          // de volta ao login dps de 3s
          setTimeout(() => navigate("/login"), 3000);
        } else {
          // caso seja algo tipo a API bugando, ou algo imprevisto
          setError("Não foi possível carregar os tópicos.");
        }
        setLoading(false);// loading false
      }
    };//fetchTopicos()

    fetchTopicos(); // roda fetchTopicos() em si, função async

  }, [navigate]); // navigate é dependencia de useEffect

  // se tiver carregando...
  // pro usuario nao ficar encarando uma tela em branco,
  // manda um carregamento provisório.
  if (loading) {
    return (
      <div>
        <Header activePage="topics" />
        <main className="center">
          <div className="general-width hero">
            <h1>Todos os tópicos disponíveis</h1>
            <p className="subtitle dark-gray">Carregando...</p>
          </div>
        </main>
        <Footer activePage="topicos" />
      </div>
    );
  }

  // agora, se der erro... tchau
  if (error) {
    return (
      <div>
        <Header activePage="topics" />
        <main className="center">
          <div className="general-width hero">
            <h1>Erro.</h1>
            <p className="subtitle dark-gray">{error}</p>
          </div>
        </main>
        <Footer activePage="topicos" />
      </div>
    );
  }

  // a página normal - loading false, error null
  return (
    <div>
      <Header activePage="topics" />
      <main className="center">
        <div className="general-width hero">
          <h1>Todos os tópicos disponíveis</h1>
          <p className="subtitle dark-gray">
            Explore os conteúdos, organizados em categorias.<br />
          </p>
        </div>

        <div className="general-width lessons">
          <div className="cards-large">
            {/* mapeia os dados do 'topicos' da API ao inves de 'topicos_cards', que era estático */}
            {topicos.map((item) => (
              <TopicCard
                key={item.id}
                img={getTopicImage(item.id)} // getTopicImage() pra pegar a imagem
                alt={item.title} // titulo vai pro alt text
                title={item.title} // API
                text={item.description} // API
                subtopics={[]} // a API não envia subtópicos
                link={`/cursos/${item.id}`} // link dinâmico para a página do curso
              />
            ))}
          </div>
        </div>
      </main>
      <Footer activePage="topicos" />
    </div>
  );

  /* antigo...
  return (
    <div>
      <Header activePage="topics" />
      <main className="center">
        <div className="general-width hero">
          <h1>Todos os tópicos disponíveis</h1>
          <p className="subtitle dark-gray">
            Explore os conteúdos, organizados em categorias.<br />
          </p>
        </div>

        <div className="general-width lessons">
          <div className="cards-large">
            {topicos_cards.map((item, index) => (
              <TopicCard
                key={index}
                img={item.img}
                alt={item.alt}
                title={item.title}
                text={item.text}
                subtopics={item.subtopics}
                link={item.link} // para linkar as páginas
              />
            ))}
          </div>
        </div>
      </main>
      <Footer activePage="topicos" />
    </div>
  );*/
}

export default Topicos;