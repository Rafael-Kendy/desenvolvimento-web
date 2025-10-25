import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";//hook pra manipular o nome do documento, useState pra controlar os componentes
import api from '../components/api'; //importada do axios, configurada na api.js

function Login() {//componente, retorna o jsx 

    useEffect(() => {//é executado assim q o componente aparece na tela
        document.title = "ChaveDigital - Login";
    }, []);//[] vazio garante q o efeito seja executado so uma vez


  //estados para os campos do formulario
  //useState é meio que uma caixa que armazena memoria pro componente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //força o navegador a ir p/ outra pág sem recarregar
  const navigate = useNavigate(); //hook para redirecionar o usuário, vem do react router dom

  //função de callback, chamada qnd o formulario eh enviado
  const handleLogin = async (event) => {
  //event contem a info do envio do formulario
    
    event.preventDefault(); //previne a pagina de ser recarregada

    console.log('Tentando fazer login...');//indica q a função foi chamada

    //o registro enviou JSON..
    // /login(backend) espera os dados do formulario no formato application/x-www-form-urlencoded e nao JSON
    //o OAuth2PasswordRequestFore exige que o campo email seja enviado como username
    const params = new URLSearchParams();//URLSearch eh pro navegador criar o formato 
    params.append('username', email); 
    params.append('password', password);
    

    try {
      const response = await api.post("/token", params);//api.post envia o params pro no backend /token como corpo da requisição, ele é no formato definido acima, preenchido com email e senha
      //await pausa a função e espera a API responder ao POST no /token, eh procurado o usuário na lista users e usa pwd_context.verify para checar se a senha está correta
      //Se o login estiver correto, ele cria um token e retorna um dicionário {"access_token": access_token, "token_type": "bearer"}
      //o token eh guardado no response pelo login.jsx

      //se o await deu bom
      console.log("Login com sucesso:", response.data);
      alert("Login bem sucedido!");

      //API retorna um acess_token que eh armazenado no localStorage
      localStorage.setItem("token", response.data.access_token);

      navigate('/perfil');//redireciona o usuario para /perfil apos autenticação bem sucedida

    } catch (error) {//se derui ruim await falhou
      console.error("Erro no login:", error);
      if (error.response?.status === 401) {//erro programado no backend(main.py)
        alert("Email ou senha incorretos");
      } else {//qlqr outro erro
        alert("Ocorreu um erro ao tentar fazer login");
      }
    }
    
  };



  return (//return define oq vai renderizar na tela
    <div id="registro">
      <main>
        {/*Login*/}
        <div className="login-container">
          <form onSubmit={handleLogin}>{/*anexa a função handleLogin ao evento onsubmit do formulario */}
            <h1 className="gold">Login</h1>
            <p className="subtitle">
              ou <Link to="/registro" className="blue">crie uma nova conta</Link>{/*link cria um link de navegação sem recarregar a pág*/}
            </p>

            <div className="input-group">
              <label htmlFor="email">Email</label>
               {/*react começa a agir aq*/}
              <input type="email" id="email" name="email" placeholder="Digite seu email" required 

              //o valor do input eh lido do estado email
              value={email}

              //smp q uma letra eh digitada chama o onChange
              onChange={(e) => setEmail(e.target.value)}//target value eh o novo valor dentro da caixa de digitar
              //setEmail atualiza o estado do email, o react renderiza e atualiza o valor no value={email} la em cima
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="Digite sua senha" required 
              value={password}//rola a msm coisa explicada pro email
              onChange={(e) => setPassword(e.target.value)}
              />
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
