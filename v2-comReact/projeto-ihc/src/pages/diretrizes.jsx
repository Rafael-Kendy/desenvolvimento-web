import { useEffect } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import TextoGeral from '../components/texto-geral'
import Documento from '../components/documento'

import diretrizesPDF from "../components/assets/diretrizes.pdf";

function Diretrizes(){
    useEffect(() => {
        document.title = "ChaveDigital - Diretrizes";
    }, []);


    const texts=[
        {
        index: 0,
        type: "justify",
        title: "Nossas diretrizes",
        content:[
            {txt: "Nosso projeto foi criado com base em valores de acessibilidade, colaboração e inclusão. Queremos que qualquer pessoa, independente de idade, conhecimento prévio ou condição social, possa aprender a usar o computador de forma simples e prática."},
            {txt: "Como somos uma iniciativa sem fins lucrativos e de código aberto, acreditamos que a construção coletiva é essencial. Por isso, todos os recursos devem seguir estas diretrizes."},
            {txt: "Nosso compromisso é garantir que a alfabetização digital seja aberta, acessível e colaborativa, para que mais pessoas possam se beneficiar da tecnologia no dia a dia."},
        ]
        },
        {
        index: 1,
        type: "justify",
        title: <>Instruções referentes a <span className="gold">primeira entrega</span></>,
        content:[
            {txt: <>Este projeto foi desenvolvido a partir de um enunciado disponibilizado pelo professor <span class="gold">Luiz Rodrigues</span>, para a matéria Desenvolvimento De Aplicações Web. Esse enunciado, assim como os direcionamentos passados em aula, serviram como ponto de partida para estruturar a ideia, os objetivos e a organização da plataforma. As diretrizes aqui apresentadas foram inspiradas nesse enunciado, mas também ampliadas para refletir nossa visão de um projeto colaborativo, inclusivo e aberto à comunidade.</>},
            {txt: "O enunciado completo do projeto pode ser visto no documento a seguir."},
        ] 
        }
    ]
    const docs=[
        {
            path: diretrizesPDF,
            type: "application/pdf",
            class: "pdf",
        }
    ]

    return (
        <diret>
            <Header activePage="guidelines"/>
            <main>
                <TextoGeral texts={texts}/>
                <Documento docs={docs}/>
            </main>
            <Footer activePage="guidelines"/>
        </diret>
    );
}

export default Diretrizes