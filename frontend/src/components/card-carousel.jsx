import Slider from "react-slick";
import Card from "./card";

function CardCarousel({cards}) {
  const settings = {
    className: "center",
    centerMode: true,
    dots: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="slider-container px-8 py-4">
        <Slider {...settings}>
            {cards.map((card) => (
                <Card title={card.title} text={card.text} color={card.color} src={card.src} alt={card.alt} size={card.size} />
            ))}
        </Slider>
    </div>
  );
}

export default CardCarousel;
