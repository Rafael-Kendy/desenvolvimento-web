import { useEffect } from "react";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    useEffect(() => {
        document.title = "ChaveDigital - Login";
    }, []);

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    // Aqui você adicionaria a lógica de autenticação
    console.log('Tentando fazer login...');
    // Se o login for bem-sucedido, navegue para o perfil
    navigate('/perfil');
  };

  return (
    <div id="registro">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h1 className="gold">Login</h1>
          <p className="subtitle">
            ou <Link to="/registro">crie uma nova conta</Link>
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

          <div className="botoes-sociais">
            <a href="https://mail.google.com" className="btn-social gmail">Gmail</a>
            <a href="https://www.facebook.com" className="btn-social facebook">Facebook</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;