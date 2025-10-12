import Header from "./components/header";
import Hero from "./components/hero";
import ComoFunc from './components/como-funciona';
import AlgunsTop from './components/alguns-topicos'
import CardGrande from './components/card-grande'
import Footer from './components/footer'
import { useEffect } from "react";

import person from "./components/assets/img/pexels-by-andrea_piacquadio.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  useEffect(() => {document.title = "ChaveDigital - Início";}, []);
  const content={
    title: "Inicie seu aprendizado hoje",
    text: [
      "Aprenda a usar o computador e a internet de forma simples e prática, com lições acessíveis e interativas.",
      "Participe gratuitamente e comece já a explorar nossos conteúdos.",
    ]
  };
  const btns=[
    {href: "/registro", label: "Crie sua conta"}
  ];
  const img={
    src: person, alt: "Um jovem",  
  }

  return (
    <div>
      <Header activePage="landing"/>
      <main>
        <Hero />
        <ComoFunc />
        <div className="bg-lightgray">
          <AlgunsTop />
        </div>
      </main>
      <div className="component bg-black">
        <CardGrande content={content} buttons={btns} image={img}/>
      </div>
      <Footer activePage="landing"/>
    </div>
  )
}

export default App