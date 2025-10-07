import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { useEffect } from "react";//hook pra manipular o nome do documento

/* settingsOption cria um item reutilizavel*/
/* o componente a torna clicavel */
/* danger-option eh aplicada se is danger for vdd(futuro)*/
const SettingsOption = ({ to, title, description, isDanger = false }) => (
    <Link to={to} className={`settings-option ${isDanger ? 'danger-option' : ''}`}>
        <div className="option-text">
            {/* exibe titulo e a descrição*/}
            <span className="option-title">{title}</span>
            <span className="option-description">{description}</span>
        </div>
        <span className="option-arrow">&gt;</span>{/* a setinha*/}
    </Link>
);

function Configuracoes() {

    useEffect(() => {
        document.title = "ChaveDigital - Configurações";
    }, []);

    return (
        <>
            <Header />

            <main id="registro">
                
                <div className="settings-container">

                    <h1 className="gold center">Configurações</h1>
                    {/* lista q agrupa as opções*/}
                    <div className="settings-list">
                        {/* n levam a lugar nenhum no momento*/}
                        <SettingsOption to="#" title="Mudar Nome de Usuário" description="Altere seu nome de exibição público" />
                        <SettingsOption to="#" title="Mudar Ícone" description="Altere sua foto de perfil" />
                        <SettingsOption to="#" title="Mudar Descrição" description="Edite a sua biografia" />
                    </div>
                    {/*danger-option */}
                    <SettingsOption to="#" title="Resetar Progressão" description="Zera todo o seu progresso nos tópicos" isDanger={false} />
                    <SettingsOption to="#" title="Deletar Conta" description="Exclui permanentemente todos os seus dados" isDanger={false} />
                </div>


            </main>

            <Footer />
        </>
    );
}

export default Configuracoes;
