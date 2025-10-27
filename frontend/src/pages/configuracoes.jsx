import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { useEffect } from "react";//hook pra manipular o nome do documento
import api from '../components/api';


/* SettingsOption cria um item reutilizável*/
/*se tiver 'to' eh um link, se tiver onClick eh um botao*/
const SettingsOption = ({ to, title, description, isDanger = false, onClick }) => {
    
    //classes do css
    const classNames = `settings-option ${isDanger ? 'danger-option' : ''}`;

    //parte interna, texto, seta
    const content = (
        <>
            <div className="option-text">
                <span className="option-title">{title}</span>
                <span className="option-description">{description}</span>
            </div>
            <span className="option-arrow">&gt;</span>
        </>
    );

    //se passar uma prop onClick, renderiza um <div> clicável
    if (onClick) {
        return (
            <div className={classNames} onClick={onClick} style={{cursor: 'pointer'}}>
                {content}
            </div>
        );
    }

    //senão renderiza um link como antes
    return (
        <Link to={to} className={classNames}>
            {content}
        </Link>
    );
};

function Configuracoes() {

    useEffect(() => {
        document.title = "ChaveDigital - Configurações";
    }, []);

    const navigate = useNavigate(); 

    //lida com o deletar da conta
    const handleDeleteAccount = async () => {
        
        //confirmação
        if (!window.confirm("Você tem certeza que deseja deletar sua conta? Esta ação é permanente e não pode ser desfeita")) {
            return; //se clicar em cancelar para aqui
        }

        //pega o token do localStorage
        const token = localStorage.getItem("token");

        if (!token) {//se nao tiver token
            alert("Você não está logado.");
            navigate("/login");
            return;
        }

        try {
            //chama o endpoint e envia token para autorização
            await api.delete("/users/me", {//await pausa e espera responder
                headers: {
                    Authorization: `Bearer ${token}`//envia o token no cabeçalho Authorization, q eh lido pelo OAuth2_scheme que entrega pro get_curent_active_user saber quem eh pra deletar
                }
            });

            //se deu certo deletar
            alert("Conta deletada com sucesso.");
            //limpa o localStorage e redireciona pro login
            localStorage.removeItem("token");
            navigate("/login");

        } catch (error) {
            //se deu ruim
            console.error("Erro ao deletar conta:", error);
            if (error.response?.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                navigate("/login");
            } else {
                alert("Ocorreu um erro ao tentar deletar sua conta.");
            }
        }
    };

    return (
        <>
            <Header />
            <main id="registro">
                <div className="settings-container">
                    <h1 className="gold center">Configurações</h1>
                    <div className="settings-list">
                        <SettingsOption to="#" title="Mudar Nome de Usuário" description="Altere seu nome de exibição público" />
                        <SettingsOption to="#" title="Mudar Ícone" description="Altere sua foto de perfil" />
                        <SettingsOption to="#" title="Mudar Descrição" description="Edite a sua biografia" />
                    </div>
                    
                    <SettingsOption 
                        to="#" 
                        title="Resetar Progressão" 
                        description="Zera todo o seu progresso nos tópicos" 
                        isDanger={false} //true muda pra vermelho
                    />
                    {/*inves de to usou onClick*/}
                    <SettingsOption 
                        onClick={handleDeleteAccount} 
                        title="Deletar Conta" 
                        description="Exclui permanentemente todos os seus dados" 
                        isDanger={true} //true muda pra vermelho
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Configuracoes;
