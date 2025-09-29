import { useEffect } from "react";
import { Link } from 'react-router-dom';


function Perfil() {
    useEffect(() => {
        document.title = "ChaveDigital - Perfil";
    }, []);

  return (
    <div id="registro"> 
      <div className="profile-page-wrapper"> 
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic">
            <img /*src={profileImage}*/ alt="Foto do Perfil" />
          </div>
          <div className="profile-info">
            <div className="username-section">
              <h1 className="gold">Nome Do Usuario</h1>
              <Link to="/configuracoes" className="settings-icon">&#9881;</Link>
            </div>
            <p className="dark-gray">emaildousuario@exemplo.com</p>
          </div>
        </div>
        <div className="profile-description">
          <h2>Descrição do Perfil</h2>
          <p className="justify">
            RANDANDANDAN
          </p>
        </div>
      </div>

      <div className="progress-container">
        <h2>Progresso</h2>
        <div className="topics-list">
          <div className="topic-item">
            <div className="topic-info">
              <div className="topic-icon">
                {/* <img src={webIcon} alt="icone" /> */}
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
                <div className="post-sidebar">
                    <div className="post-image-placeholder"><span>Imagem</span></div>
                    <div className="post-stats dark-gray">
                        <span>&#128077; 15 Likes</span>
                        <span>&#128172; 3 Comentários</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
 </div>
  );
}

export default Perfil;