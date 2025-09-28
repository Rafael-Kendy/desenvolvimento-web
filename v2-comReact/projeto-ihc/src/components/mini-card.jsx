function MiniCard({ img, alt, title, text }) {
  return (
    <div className="mini-card">
      <figure>
        <img src={img} alt={alt} className="img-smaller" />
      </figure>
      <h4>{title}</h4>
      <p className="subsubtitle dark-gray">{text}</p>
    </div>
  );
}

export default MiniCard;
