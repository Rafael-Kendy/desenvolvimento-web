import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { useEffect, useState } from "react";//hook pra manipular o nome do documento
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

    //estados para os campos do formulario
    //useState é meio que uma caixa que armazena memoria pro componente
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true); //estado de carregando igual no perfil.jsx

    //GET
    useEffect(() => {//igual no perfil.jsx
        const fetchUserData = async () => {
            //pega o token do localStorage
            const token = localStorage.getItem("token");
            if (!token) {//se n tiver token
                alert("Você não está logado.");
                navigate('/login');
                return;
            }
            try {
                //envia o token pro GET no /users/me para pegar os dados atuais
                const response = await api.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                //response.data com  id,name,email,description
                setName(response.data.name);//set aqui e embaixo pra exibir os dados
                setDescription(response.data.description || "");//"" se for nula
            
            } catch (error) {//tratamento de erro igual no perfil.jsx
                console.error("Erro ao carregar dados:", error);
                if (error.response?.status === 401) {
                    alert("Sessão expirada. Faça login.");
                    navigate('/login');
                }
            } finally {
                setLoading(false);//para de carregar
            }
        };
        fetchUserData();
    }, [navigate]);



    //PUT
    const handleSubmit = async (event) => {//chamada quando clica em salvar alterações, por causa do onSubmit
        event.preventDefault(); //impede o recarregamento da pag

        const token = localStorage.getItem("token");
        if (!token) { return; }//verificaçaõ de segurança

        try {
            //faz pedido pro PUT do /users/me
            const response = await api.put("/users/me",{
                    //corpo da requisição, recebe na user_update
                    name: name,//valores sao atualizados pelo onChange dos inputs
                    description: description
                },
                { //get_current_active_user
                    headers: { 
                        Authorization: `Bearer ${token}` } //envia o token no cabeçalho Authorization, q eh lido pelo OAuth2_scheme que entrega pro get_curent_active_user saber quem eh pra atualizar
                }
            );
            
            //deu bom
            alert("Perfil atualizado com sucesso!");
            //redireciona pro perfil
            navigate('/perfil');

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Não foi possível atualizar o perfil.");
        }
    };




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
                    Authorization: `Bearer ${token}` //envia o token no cabeçalho Authorization, q eh lido pelo OAuth2_scheme que entrega pro get_curent_active_user saber quem eh pra deletar
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
                    <h1 className="gold center">Editar Perfil</h1>
                    
                    {/* Mostra "Carregando..." ou o Formulário */}
                    {loading ? (
                        <p style={{textAlign: "center"}}>Carregando...</p>
                    ) : (
                        // 1. Substituímos a lista por um <form>
                        <form onSubmit={handleSubmit}>
                            
                            {/* 2. Campo para mudar o nome */}
                            <div className="input-group">
                                <label htmlFor="name">Nome de Usuário</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            
                            {/* 3. Campo para mudar a descrição */}
                            <div className="input-group">
                                <label htmlFor="description">Descrição (Biografia)</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    placeholder="Fale um pouco sobre você..."
                                />
                            </div>
                            
                            {/* 4. Botão para salvar */}
                            <button type="submit">Salvar Alterações</button>
                        </form>
                    )}

                    {/* Linha divisória */}
                    <hr style={{margin: "2rem 0", borderTop: "1px solid var(--light-gray)"}} />
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
