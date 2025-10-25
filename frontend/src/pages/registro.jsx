import { Link, useNavigate } from 'react-router-dom';//importa diretamente da biblioteca de roteamento para permitir a navegação entre páginas sem recarregar o site
import { useEffect, useState} from "react";//hook pra manipular o nome do documento e criar estados
import api from '../components/api'; //importada do axios, configurada na api.js

function Registro() {//componente, ela retorna um bloco de jsx

    useEffect(() => {//é executado assim q o componente aparece na tela
        document.title = "ChaveDigital - Criar conta";
    }, []);//[] vazio garante q o efeito seja executado so uma vez

    //estados para os campos do formulario
    //useState é meio que uma caixa que armazena memoria pro componente
    const [name, setName] = useState(""); //primeira variavel le, a segunda com set atualiaza
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //força o navegador a ir p/ outra pág sem recarregar
    const navigate = useNavigate(); //hook para redirecionar o usuário, vem do react router dom

    //função de callback, chamada qnd o formulario eh enviado
    const handleSubmit = async (event) => {// lida com o evento de envio de formulario, async pq usa await p/ esperar resposta da API
    //event contem a info do envio do formulario

      event.preventDefault();//impede o recarregamento da pág

      //validação do frontend antes de ir pra API
        if (password !== confirmPassword) {//le o valor direto das variaveis password e confirm...
            alert("As senhas não coincidem!");
            return;
        }

        //onde tenta enviar pro backend
        try {//api.post envia o objeto JSON pro backend no endpoint /registro na main.py
            const response = await api.post("/registro", {//await pausa a funçaõ aqui e espera o api.post terminar, espera o new_user vir e armazena no response
            //response eh oq recebe de volta do backend
            

                //o que eh enviado pro backend
                //corpo da requisição, objeto JSON usando os valores de estado
                name: name,
                email: email,
                password: password
            });
            
            //await terminou

            //se deu bom
            console.log("Registro enviado com sucesso:", response.data);
            alert("Conta criada com sucesso! Você será redirecionado para o login");
            navigate('/login'); //redireciona para a página de login

        } catch (error) { //se deu ruim, await falhou
            console.error("Erro no registro:", error);
            if (error.response?.status === 400) {//erro programado no backend(main.py)
                alert("Erro: este email já está cadastrado!");
            } else {//qlqr outro erro
                alert("Ocorreu um erro ao criar sua conta!");
            }
        }
    
  };

  
  return (//return define oq vai renderizar na tela
    <div id="registro">
      <main>
        {/*Login*/}
        <div className="login-container">{/**/}
          <form onSubmit={handleSubmit}>{/*anexa a função handle submit ao evento onsubmit do formulario */}
            <h1 className="gold">Criar Conta</h1> {/*quando o botão submit for clicado handleSubmit será chamada*/}

            <p className="subtitle"> {/**/}
              ou entre com uma <Link to="/login" className="blue">conta existente</Link>{/*link cria um link de navegação sem recarregar a pág*/}
            </p> {/*o link faz uma navegação para a rota sem recarregar a pagina, deixando mais fluido */}

            <br />

            <div className="input-group">
              <label htmlFor="name">Nome</label>{/*para associar uma label a um input usa htmlFor inves de so for */}
              {/*react começa a agir aq*/}
              <input type="text" id="name" name="name" placeholder="Digite seu nome" required 
              //o valor exibido no input é sempre oq ta nesse name
              value={name} 
              
              //smp q uma letra eh digitada chama o onChange
              onChange={(e) => setName(e.target.value)}//target value eh o novo valor dentro da caixa de digitar
              //setName atualiza o estado de name, o react renderiza e atualiza o valor no value={name} la em cima
              />

            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Digite seu email" required 
              value={email}//rola a msm coisa explicada pro name
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="Digite sua senha" required 
              value={password}//rola a msm coisa explicada pro name
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirme a Senha</label>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Digite novamente sua senha" required 
              value={confirmPassword}//rola a msm coisa explicada pro name
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <p>
              <Link to="/diretrizes" className="blue">Termos de uso</Link>
            </p>

            <button type="submit">Criar Conta</button>{/*submit automaticamente dispara o onSubmit do formulario*/}
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
