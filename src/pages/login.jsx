import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";//hook pra manipular o nome do documento

function Login() {

    useEffect(() => {
        document.title = "ChaveDigital - Login";
    }, []);//[] vazio garante q o efeito seja executado so uma vez

  const navigate = useNavigate();//inicializa hook que pode redirecionar o usuario para outras rotas de forma programada

  const handleLogin = (event) => {//eh chamada quando o formulario eh submetido
    event.preventDefault(); //previne a pagina de ser recarregada
    
    console.log('Tentando fazer login...');//indica q a função foi chamada
    //api?
    
    navigate('/perfil');//redireciona o usuario para /perfil apos autenticação bem sucedida
  };

  return (
    
    <div id="registro">
      
      <main>
        {/*Login*/}
        <div className="login-container">
          <form onSubmit={handleLogin}>{/*formulario chama a função handle.. ao ser submetido */}
            <h1 className="gold">Login</h1>
            <p className="subtitle">
              ou <Link to="/registro" className="blue">crie uma nova conta</Link>{/*se linka com registro */}
            </p>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Digite seu email" required />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="Digite sua senha" required />
            </div>

            <button type="submit">Entrar</button>

            <p className="subtexto-acesso">ou acesse usando</p>

            {/*Botoes sociais */}
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

export default Login;
