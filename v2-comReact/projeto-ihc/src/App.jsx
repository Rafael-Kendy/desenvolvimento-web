import Header from "./components/header";
import Hero from "./components/hero";
import ComoFunc from './components/como-funciona';
import AlgunsTop from './components/alguns-topicos'
import RegCard from './components/registro-card'
import Footer from './components/footer'

function App() {
  const links=[
    {id:"topics", href: "/topicos", label: "Tópicos"},
    {id:"community", href: "/comunidade", label: "Comunidade"},
    {id:"about", href: "/sobre", label: "Sobre"}
  ];

  const footer_links=[
    {id:"guidelines", href:"/diretrizes", label: "Diretrizes"},
    {id:"topics", href: "/topicos", label: "Tópicos"},
    {id:"community", href: "/comunidade", label: "Comunidade"},
    {id:"about", href: "/sobre", label: "Sobre"}
  ];

  return (
    <div>
      <Header links={links} activePage="landing"/>
      <main>
        <Hero />
        <ComoFunc />
        <div className="bg-lightgray">
          <AlgunsTop />
        </div>
        <div className="component bg-black">
          <RegCard />
        </div>
      </main>
      <div className="bg-black">
        <Footer links={footer_links} activePage="landing"/>
      </div>
    </div>
  )
}

export default App