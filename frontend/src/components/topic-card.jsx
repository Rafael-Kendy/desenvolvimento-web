import { Link } from "react-router-dom";

function TopicCard({ img, alt, title, text, link }) {
  return (
    <Link to={link} className="topic-card-link" style={{ textDecoration: 'none' }}>
      
      <div className="topic-card-visual">
        
        {/* Ícone */}
        <img src={img} alt={alt} className="topic-card-img" />
        
        {/* Textos */}
        <div style={{width: '100%'}}>
            <h3 className="topic-card-title">{title}</h3>
            <p className="topic-card-text">{text}</p>
        </div>
        
        {/* Botão Visual */}
        <span className="card-cta">
            Acessar Curso →
        </span>

      </div>

    </Link>
  );
}

export default TopicCard;