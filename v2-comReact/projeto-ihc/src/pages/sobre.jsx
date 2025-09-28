import Header from "../components/header";
import Footer from '../components/footer'
import TextoGeral from '../components/texto-geral'
import CardGrande from '../components/card-grande'

function Sobre(){
    const texts=[
        {
        index: 0,
        type: "justify",
        title: <>Sobre a <span class="sans-serif gold">ChaveDigital</span></>,
        content:[
            {txt: "Nossa plataforma nasceu com a missão de facilitar o acesso ao mundo digital, ajudando pessoas a aprenderem de forma simples e prática como utilizar computadores e a internet em seu dia a dia. Acreditamos que a alfabetização digital é um passo essencial para promover inclusão, independência e novas oportunidades, seja no trabalho, nos estudos ou na vida pessoal."},
            {txt: <>omos uma iniciativa <span class="gold">sem fins lucrativos</span>, comprometida em oferecer conteúdo gratuito e acessível para todos. Além disso, todo o nosso projeto é de <span class="gold">código aberto</span>, permitindo que qualquer pessoa possa colaborar na criação, melhoria e manutenção dos recursos disponíveis. Dessa forma, unimos forças da comunidade para garantir que nossa plataforma esteja sempre evoluindo e atendendo às necessidades de quem está dando os primeiros passos no universo digital.</>},
            {txt: <>Mais do que ensinar tecnologia, queremos construir um espaço de <span class="gold">aprendizado colaborativo</span>, no qual cada contribuição ajuda a ampliar o impacto e a democratizar o acesso ao conhecimento digital.</>},
        ]
        }
    ];
    const refs=[
        {
            index: 1,
            type: "center",
            title: "Inspirações",
            content: [
                {txt: "https://www.theodinproject.com"},
                {txt: "https://www.gov.br/secom/pt-br/assuntos/educacao-midiatica/repositorio-geral/pessoa-idosa"},
                {txt: "https://www.learnmyway.com/",},
                {txt: "https://cyberseniors.org/"},
                {txt: "https://www.getsetup.io/"},
                {txt: "https://edu.gcfglobal.org/en/"},
                {txt: "https://dssi-erasmus.com/"},
                {txt: "https://training.digitallearn.org/"},
            ]
        },
        {
            index: 3,
            type: "center",
            title: "Elementos gráficos",
            content: [
                {txt: "https://www.flaticon.com/"},
                {txt: "https://fontawesome.com/"},
            ]
        },
        {
            index: 5,
            type: "center",
            title: "Imagens",
            content: [
                {txt: <>https://www.pexels.com/photo/man-in-blue-long-sleeve-sweater-using-cellphone-3783348/ • <span className="gold">by Andrea Piacquadio</span></>},
                {txt: <>https://www.vecteezy.com/vector-art/43346593-mountain-hand-drawn-background-minimal-landscape-art-with-line-art-contouring-abstract-art-wallpaper-illustration-for-prints-decoration-interior-decor-wall-arts-canvas-prints?utm_source=pinterest&utm_medium=social • <span className="gold">by Prasong Tadoungsorn</span></>},
        ]
    }
    ];

    const content={
        title: "Colabore com o projeto",
        text: [
        "Nosso trabalho é aberto e colaborativo, e acreditamos que juntos podemos ir ainda mais longe. Se você tem interesse em contribuir — seja criando conteúdos, melhorando materiais existentes ou ajudando na manutenção da plataforma — sua participação será muito bem-vinda!",
        "Venha fazer parte dessa iniciativa e ajude a levar a alfabetização digital a ainda mais pessoas.",
        ]
    };
    const btns=[
        {href: "https://github.com/Rafael-Kendy/desenvolvimento-web/tree/main", label: "Colabore com o projeto"},
        {href: "https://www.paypal.com/br/home", label: "Faça uma doação"},
    ];

    return(
        <sobre>
            <Header activePage="about"/>
            <main>
                <TextoGeral texts={texts}/>
                <TextoGeral texts={refs}/>
            </main>
            <div className="bg-black">
                <CardGrande content={content} buttons={btns}/>
            </div>
            <Footer activePage="about"/>
        </sobre>
    );
}

export default Sobre