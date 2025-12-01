import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api"; // Importe a api configurada

// Imagens Fallback
import internetIcon from "./assets/img/internet.png";
import pcIcon from "./assets/img/computer-desktop.png";
import zapIcon from "./assets/img/phone-call.png";

const iconMap = {
  "internet.png": internetIcon,
  "computer-desktop.png": pcIcon,
  "phone-call.png": zapIcon,
};

function AlgunsTop() {
    const [courses, setCourses] = useState([]);

    const getTopicImage = (imageName) => {
        if (!imageName) return internetIcon;
        if (imageName.startsWith("http")) return imageName;
        return iconMap[imageName] || internetIcon;
    };

    useEffect(() => {
        const fetchRecentCourses = async () => {
            try {
                // Busca do seu Backend Local
                const response = await api.get("/cursos");
                setCourses(response.data.slice(0, 3)); // Pega só os 3 primeiros
            } catch (error) {
                console.error("Erro ao carregar destaques:", error);
            }
        };
        fetchRecentCourses();
    }, []);

    if (courses.length === 0) return null;

    return (
        <div className="center">
            <div className="component general-width topics">
                <h2 style={{marginBottom: '30px'}}>Comece por aqui</h2>
                <div className="cards">
                    {courses.map((course) => (
                        <div key={course.id} className="card-medium bg-white" style={{padding: '20px', borderRadius: '10px'}}>
                            <figure style={{marginBottom: '15px'}}>
                                <img 
                                    src={getTopicImage(course.image)} 
                                    alt={course.title} 
                                    style={{height: '60px', objectFit: 'contain'}} 
                                />
                            </figure>
                            <div className="center">
                                <h3 className="blue">{course.title}</h3>
                                <p className="dark-gray">{course.description}</p>
                                <Link to={`/cursos/${course.id}`} className="btn-padrao" style={{marginTop: '15px', display: 'inline-block'}}>
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AlgunsTop;