import TextoGeral from '../components/texto-geral'

function Diretrizes(){
    const texts=[
        {
            title: "Nossas diretrizes",
            content:[
                {txt: "Nosso projeto foi criado com base em valores de acessibilidade, colaboração e inclusão. Queremos que qualquer pessoa, independente de idade, conhecimento prévio ou condição social, possa aprender a usar o computador de forma simples e prática."},
                {txt: "Como somos uma iniciativa sem fins lucrativos e de código aberto, acreditamos que a construção coletiva é essencial. Por isso, todos os recursos devem seguir estas diretrizes:"},
                {txt: "Nosso compromisso é garantir que a alfabetização digital seja aberta, acessível e colaborativa, para que mais pessoas possam se beneficiar da tecnologia no dia a dia."},
            ]
        }
    ]

    return (
        <diret>
            <TextoGeral texts={texts}/>
        </diret>
    );
}

export default Diretrizes