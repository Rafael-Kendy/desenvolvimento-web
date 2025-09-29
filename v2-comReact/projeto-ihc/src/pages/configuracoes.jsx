import { Link } from 'react-router-dom';

const SettingsOption = ({ to, title, description, isDanger = false }) => (
    <Link to={to} className={`settings-option ${isDanger ? 'danger-option' : ''}`}>
        <div className="option-text">
            <span className="option-title">{title}</span>
            <span className="option-description">{description}</span>
        </div>
        <span className="option-arrow">&gt;</span>
    </Link>
);

function Configuracoes() {
    return (
        <div id="registro">
            <div className="settings-container">
                <h1 className="gold center">Configurações</h1>
                <div className="settings-list">
                    <SettingsOption to="#" title="Mudar Nome de Usuário" description="Altere seu nome de exibição público" />
                    <SettingsOption to="#" title="Mudar Ícone" description="Altere sua foto de perfil" />
                    <SettingsOption to="#" title="Mudar Descrição" description="Edite a sua biografia" />
                </div>
                <SettingsOption to="#" title="Resetar Progressão" description="Zera todo o seu progresso nos tópicos" isDanger={true} />
                <SettingsOption to="#" title="Deletar Conta" description="Exclui permanentemente todos os seus dados" isDanger={true} />
            </div>
        </div>
    );
}

export default Configuracoes;