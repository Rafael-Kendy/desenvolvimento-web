import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api"; 

import Header from "../components/header";
import Footer from '../components/footer'
import TopicCard from "../components/topic-card";

import internetIcon from "../components/assets/img/internet.png";
import pcIcon from "../components/assets/img/computer-desktop.png";
import zapIcon from "../components/assets/img/phone-call.png";

const iconMap = {
  "internet.png": internetIcon,
  "computer-desktop.png": pcIcon,
  "phone-call.png": zapIcon,
};

function Topicos() {
  const [topicos, setTopicos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  const getTopicImage = (imageName) => {
    if (!imageName) return internetIcon; 
    if (imageName.startsWith("http")) return imageName; 
    return iconMap[imageName] || internetIcon; 
  };

  useEffect(() => {
    document.title = "ChaveDigital - Todos os tópicos";
    
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        // Chamada à API
        const response = await api.get("/cursos", headers);
        setTopicos(response.data);

      } catch (err) {
        console.error("Erro ao buscar tópicos:", err);
        setError("Não foi possível carregar os cursos. Verifique se o servidor está rodando.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div>
        <Header activePage="topicos" />
        <main className="center general-width hero-topics">
           <h2 className="blue">Carregando tópicos...</h2>
        </main>
        <Footer activePage="topicos" />
      </div>
    );
  }

  if (error) {
    return (
        <div>
          <Header activePage="topicos" />
          <main className="center general-width hero-topics">
             <h1 className="red">Ops!</h1>
             <p>{error}</p>
          </main>
          <Footer activePage="topicos" />
        </div>
      );
  }

  return (
    <div>
      <Header activePage="topicos" />
      
      <main className="center">
        
        <section className="general-width hero-topics">
          <h1 className="gold">Todos os tópicos disponíveis</h1>
          <p className="subtitle dark-gray">
            Selecione uma das opções abaixo para começar a aprender.
          </p>
        </section>

        <section className="general-width lessons-grid-container">
          <div className="cards-large">
            {topicos.map((item) => (
              <TopicCard
                key={item.id}
                img={getTopicImage(item.image)} 
                alt={`Ícone do curso ${item.title}`}
                title={item.title}
                text={item.description}
                link={`/cursos/${item.id}`} 
              />
            ))}
          </div>
        </section>

      </main>
      
      <Footer activePage="topicos" />
    </div>
  );
}

export default Topicos;