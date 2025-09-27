import { useState } from 'react'
import Header from "./components/header";

function App() {
  const links=[
    {id:"topics", href: "/topicos", label: "Tópicos"},
    {id:"community", href: "/comunidade", label: "Comunidade"},
    {id:"about", href: "/sobre", label: "Sobre"}
  ];

  return (
    <div>
      <Header links={links} activePage="landing"/>
    </div>
  )
}

export default App