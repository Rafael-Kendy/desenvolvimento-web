import { Link, useNavigate } from 'react-router-dom';//importa diretamente da biblioteca de roteamento para permitir a navegação entre páginas sem recarregar o site
import { useEffect, useState} from "react";//hook pra manipular o nome do documento
import api from '../components/api';

function Registro() {//componente, ela retorna um bloco de jsx

    useEffect(() => {
        document.title = "ChaveDigital - Criar conta";
    }, []);//[] vazio garante q o efeito seja executado so uma vez

    //estados para os campos do formulario
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate(); //hook para redirecionar o usuário

    const handleSubmit = async (event) => {//agora usa funções, no caso handlesubmit, pra lidar com o evento de envio de formulario
      event.preventDefault();

      // 1. Validar senha no frontend
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        // 2. Tentar enviar para o backend
        try {
            const response = await api.post("/registro", {
                name: name,
                email: email,
                password: password
            });
            
            console.log("Registro enviado com sucesso:", response.data);
            alert("Conta criada com sucesso! Você será redirecionado para o login.");
            navigate('/login'); // Redireciona para a página de login

        } catch (error) {
            console.error("Erro no registro:", error);
            if (error.response?.status === 400) {
                alert("Erro: Este email já está cadastrado.");
            } else {
                alert("Ocorreu um erro ao criar sua conta.");
            }
        }
    
  };

  //o codigo parece com html mas é jsx, o navegador n entende jsx, etnao usa uma ferramenta pra pra converter pra javascript
  return (//return define oq vai renderizar na tela
    <div id="registro">
      <main>
        {/*Login*/}
        <div className="login-container">{/*usa class name inves de de class */}
          <form onSubmit={handleSubmit}>{/* anexa a função handle submit ao evento onsubmit */}
            <h1 className="gold">Criar Conta</h1>

            <p className="subtitle">
              ou entre com uma <Link to="/login" className="blue">conta existente</Link>
            </p> {/*o link faz uma navegação para a rota sem recarregar a pagina, deixando mais fluido */}

            <br />

            <div className="input-group">
              <label htmlFor="name">Nome</label>{/*para associar uma label a um input usa htmlFor inves de so for */}
              <input type="text" id="name" name="name" placeholder="Digite seu nome" required 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              />

            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Digite seu email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="Digite sua senha" required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirme a Senha</label>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Digite novamente sua senha" required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <p>
              <Link to="/diretrizes" className="blue">Termos de uso</Link>
            </p>

            <button type="submit">Criar Conta</button>
            <p>ou acesse usando</p>

            {/*botoes sociais*/}
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

export default Registro;/*exporta o registro para q possa ser usado em outras aplicações*/


    
