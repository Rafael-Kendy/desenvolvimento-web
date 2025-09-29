import { useEffect } from "react";
import { Link } from 'react-router-dom';//importa diretamente da biblioteca de roteamento

function Registro() {//componente, ela retorna um bloco de jsx
    useEffect(() => {
        document.title = "ChaveDigital - Criar conta";
    }, []);

  const handleSubmit = (event) => {//agora usa funções, no caso handlesubmit, pra lidar com o evento de envio de formulario
    event.preventDefault();
    //futuramente, colocar a logica de envio do formulario, pra um servidor, backend, etc
    console.log("Registro enviado.");
    
  };

  //o codigo parece com html mas é jsx, o navegador n entende jsx, etnao usa uma ferramenta pra pra converter pra javascript
  return (
    <div id="registro">
      <main>
        <div className="login-container">{/*usa class name inves de de class */}
          <form onSubmit={handleSubmit}>{/* anexa a função handle submit ao evento onsubmit */}
            <h1 className="gold">Criar Conta</h1>

            <p className="subtitle">
              ou entre com uma <Link to="/login" className="blue">conta existente</Link>
            </p> {/*o link faz uma navegação para a rota sem recarregar a pagina, deixando mais fluido */}

            <br />

            <div className="input-group">
              <label htmlFor="name">Nome</label>{/*para associar uma label a um input usa htmlFor inves de so for */}
              <input type="text" id="name" name="name" placeholder="Digite seu nome" required />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Digite seu email" required />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="Digite sua senha" required />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirme a Senha</label>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Digite novamente sua senha" required />
            </div>

            <p>
              <Link to="/diretrizes" className="blue">Termos de uso</Link>
            </p>

            <button type="submit">Criar Conta</button>
            <p>ou acesse usando</p>

            <div className="botoes-sociais">
              <a href="https://mail.google.com" className="btn-social gmail">Gmail</a>
              <a href="https://www.facebook.com" className="btn-social facebook">Facebook</a>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default Registro;