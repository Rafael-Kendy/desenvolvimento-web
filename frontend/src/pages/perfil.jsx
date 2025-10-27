import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header'; 
import Footer from '../components/footer';
import profileImage from '../components/assets/img/sexy.png';
import { useEffect, useState } from "react";//hook pra manipular o nome do documento
import api from '../components/api';

function Perfil() {
    useEffect(() => {
        document.title = "ChaveDigital - Perfil";
    }, []);

    //estados para guardar os dados do usuario e o status de carregamento
    const [user, setUser] = useState(null);//user guarda o objeto que vem da API
    const [loading, setLoading] = useState(true);//loading eh um booleano pra controlar o carregando da pagina
    const navigate = useNavigate(); //para redirecionar se o login falhar

    useEffect(() => {
        //função async para buscar os dados
        const fetchUserData = async () => {

            //pega o token salvo no login, do localStorage que ta no login.jsx
            const token = localStorage.getItem("token");//login.jsx que salvou o token 

            //verificaçaõ de segurança
            if (!token) {//se n houver token
                alert("Você não está logado!");
                navigate('/login');//redireciona p/ login
                return;//para a execução da funçaõ
            }

            try {//Faz a chamada GET para o endpoint
                //envia o token no cabeçalho Authorization
                const response = await api.get("/users/me", {//novamente com await p esperar a api.get terminar
                  //response eh so um objeto grande, os dados sao guarados no .data la em baixo
                    headers: {//envia o token no cabeçalho p/ que o get_current_active_user possa autenticar
                        Authorization: `Bearer ${token}`//envia o token pro backend, é uma autorização pro api.get pegar os dados
                        
                    }
                });
                
                //salva os dados do usuário no estado user, se deu bom
                setUser(response.data);//response.data tem o objeto id,nome,email

            } catch (error) {//se deu ruim
                console.error("Erro ao buscar dados do usuário:", error);
                //se o token for inválido/expirado o backend retorna 401
                if (error.response?.status === 401) {
                    alert("Sua sessão expirou. Faça login novamente.");
                    localStorage.removeItem("token"); //limpa o token invalido
                    navigate('/login');
                }
            } finally {//sempre roda
                //para de mostrar o "carregando"
                setLoading(false);//se a tentativa de busca terminou, para o loading
            }
        };

        fetchUserData(); //executa a funçao

    }, [navigate]); //navigate eh um dependencia



  //mostra o loading enquanto for true
  if (loading) {
      return (
          <>
              <Header activePage="perfil"/>
              <main id="registro">
                  <div className="profile-container">
                      <h1>Carregando perfil...</h1>
                  </div>
              </main>
              <Footer activePage="perfil"/>
          </>
      );
  }

  //se loading for false e user null
  if (!user) {//n chegou a chamar o setUser
      return (
          <>
              <Header activePage="perfil"/>
              <main id="registro">
                  <div className="profile-container">
                      <h1>Erro ao carregar perfil.</h1>
                      <p>Tente fazer <Link to="/login">login</Link> novamente.</p>
                  </div>
              </main>
              <Footer activePage="perfil"/>
          </>
      );
  }

  //se loading for false e user nao for null
  return (//exibe perfil
    <>
      <Header activePage="perfil"/>
      
      <main id="registro">
        
        <div className="profile-container">

          <div className="profile-header">
            <div className="profile-pic">
              <img src={profileImage} alt="Foto do Perfil" />
            </div>
            <div className="profile-info">
              <div className="username-section">
                {/*o nome vem do estado user */}
                <h1 className="gold">{user.name}</h1>
                <Link to="/configuracoes" className="settings-icon">&#9881;</Link>
              </div>
              {/*o email vem do estado user */}
              <p className="dark-gray">{user.email}</p>
            </div>
          </div>

          {/*descrição do perfil/biografia */}
          <div className="profile-description">
            <h2>Descrição do Perfil</h2>
            <p className="justify">
              {user.description || "..."}{/*p/ aparecer oq o usuario modificou da descriçaõ*/}
            </p>
          </div>

        </div> 

        {/*parte estatica ainda */}
        <div className="progress-container">

          <h2>Progresso</h2>

          <div className="topics-list">
            <div className="topic-item">
              <div className="topic-info">
                <div className="topic-icon">
                </div>
                <span className="topic-name blue bold">Tópico</span>
              </div>
              <div className="topic-progress">
                <span className="progress-percentage bold">25%</span>
                <span className="progress-details dark-gray">5 de 20 lições feitas</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="posts-container">
          <h2>Postagens</h2>

          <div className="posts-list">
              <div className="post-item">
                  <div className="post-content">
                      <p className="post-topic dark-gray">Tópico</p>
                      <h3 className="post-title blue bold">Exemplo</h3>
                      <p className="post-date medium-gray">27 de setembro de 2025</p>
                  </div>
                  <div className="post-sidebar">{/*barra lateral q divide o perfil*/}
                      <div className="post-image-placeholder"><span>Imagem</span></div>
                      <div className="post-stats dark-gray">
                          <span>&#128077; 15 Likes</span>
                          <span>&#128172; 3 Comentários</span>
                      </div>
                  </div>
              </div>
          </div>

        </div>

      </main> 
      
      <Footer activePage="perfil"/>
    </>
  );
}


export default Perfil;
