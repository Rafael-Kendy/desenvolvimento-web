import Header from "./components/header";
import Hero from "./components/hero";
import ComoFunc from './components/como-funciona';
import AlgunsTop from './components/alguns-topicos'
import RegCard from './components/registro-card'
import Footer from './components/footer'

function App() {
  return (
    <div>
      <Header activePage="landing"/>
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
      <Footer/>
    </div>
  )
}

export default App