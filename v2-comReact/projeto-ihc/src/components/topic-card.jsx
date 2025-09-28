import { Link } from "react-router-dom";  
import MiniCard from "./mini-card";

function TopicCard({ img, alt, title, text, subtopics, link }) {
  return (
    <Link to={link} className="topic-card-link">
      <div className="card-large bg-lightgray">
        <figure>
          <img src={img} alt={alt} className="img-small" />
        </figure>
        <h3>{title}</h3>
        <p>{text}</p>

        {subtopics && subtopics.length > 0 && (
          <div className="mini-cards">
            {subtopics.map((sub, index) => (
              <MiniCard
                key={index}
                img={sub.img}
                alt={sub.alt}
                title={sub.title}
                text={sub.text}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default TopicCard;