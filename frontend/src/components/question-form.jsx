import { useState, useEffect } from 'react';
import LabelField from "./label-field";
import Modal from './modal';
import api from '../components/api'; // (Verifique se o caminho ../components/api está certo para sua pasta)

function QuestionForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    question: "",
    image: null,
  });

  const [modalOpen, setModalOpen] = useState(false); //abre o modal
  const [searchResult, setSearchResult] = useState(""); //qnd for pra pesquisa da net
  const [source, setSource] = useState(""); //fonte da pesquisa, qual das 2 api ta usando
  const [user, setUser] = useState(null); //pra quando o user ta logado



  //pra pegar dados de edicao caso seja, 
  useEffect(() => {
    if(initialData){ //caso de edicao, ja recebe a questao e joga nos campos
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        title: initialData.title || "",
        question: initialData.question || "",
        image: null,
      });
    }
  }, [initialData]); //roda sempre que initialData muda


//roda quando carrega a pagina
  useEffect(() => {
    const fetchUser=async() => {
      const token = localStorage.getItem("token"); //verifica se tem token
      if(!token)return; //se nao tiver token, nao deve estar logado

      try{
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }); //manda o token pra validar

        if(res.ok){ //se tiver tudo certo, pega o nome e email pra preencher o form
          const userData = await res.json();
          setUser(userData);
          setFormData((prev) => ({
            ...prev,
            name: userData.name,
            email: userData.email,
          }));
        }else{
          console.warn("Usuário não autenticado ou token expirado.");
        }
      }catch(err){
        console.error("Erro ao buscar dados do usuário:", err);
      }
    };

    fetchUser();
  }, []);


  //cuida das mudancas no input do form, sempre q algum campo muda
  const handleChange = (e) => {
    const {name, value, files} = e.target; //pega o nome do campo, valor e arquivo se tiver, e.target seria o campo em si
    setFormData({
      ...formData, //mantem o restante que tava escrito
      [name]: files? files[0] : value, //atualiza so o campo que mudou
    });
  };


  //quando submete o formulário
  const handleSubmit=(e) => {
    e.preventDefault();
    onSubmit?.(formData);
    //se tiver logado, pega o email o nome
    if(user){
      setFormData({
        name: user.name,
        email: user.email,
        title: "",
        question: "",
        image: null,
      });
    }else{
      //se nao, reseta tds os campos do form
      setFormData({
        name: "",
        email: "",
        title: "",
        question: "",
        image: null,
      });
    }
  };


  //pras API do duckduckgo e da wikipedia
  const handleSearch=async() => {
    if(!formData.title.trim()){ //a busca e feita usando o titulo da duvida, entao tem q ter algo nele pra usar
      alert("A funcionalidade de busca usa o título da dúvida, por favor digite um título antes de pesquisar.");
      return;
    }

    //codifica o titulo pra usar certo (tipo espaco virar %20, da pra ver isso nas url de pesquisa do google)
    const query = encodeURIComponent(formData.title);

    try{
      //tenta na wikipedia primeiro, aqui faz uma busca pelo titulo da duvida
      const searchRes = await fetch(
        `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
      );
      const searchData = await searchRes.json(); //pega o resultado via json

      if(searchData.query.search.length > 0){ //se retornou algo, pega a primeira pagina como resposta
        const firstTitle = searchData.query.search[0].title;
        const summaryRes = await fetch( //outra request pra pegar o resumo dessa pagina
          `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`
        );
        const summaryData = await summaryRes.json(); //converte
      
        if(summaryData.extract){ //se tiver alguma coisa, mostra no modal 
          setSearchResult(summaryData.extract);
          setSource("Wikipedia");
          setModalOpen(true);
          return;
        }
      }

      //se nao der na wikipedia, tenta pelo duckduckgo
      const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`); //faz a request
      const ddgData = await ddgRes.json();

      //extrai a resposta, prioridade pelo resumo, topicos relacionados, definicao e entao uma mensagem padrao
      const answer =
        ddgData.AbstractText ||
        (ddgData.RelatedTopics?.[0]?.Text ?? "") ||
        ddgData.Definition ||
        "Não foi possível encontrar uma explicação sobre o título inserido.";

      //abre o modal
      setSearchResult(answer);
      setSource("DuckDuckGo");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar informações:", error);
      alert("Erro ao buscar informações. Tente novamente mais tarde.");
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>

        <div className="flex-between">
          <LabelField 
            icon="fa-solid fa-user-tag"
            label="Nome"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Digite seu nome"
          />
          <LabelField 
            icon="fa-solid fa-envelope"
            label="E-mail"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Digite seu email"
          />
          <LabelField 
            icon="fa-solid fa-image"
            label="Imagem"
            name="image"
            type="file"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

          <LabelField 
            icon="fa-solid fa-ad"
            label="Título"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Digite um título que resuma sua dúvida"
          />

        <LabelField 
          icon="fa-solid fa-circle-question"
          label="Dúvida"
          name="question"
          type="area"
          value={formData.question}
          onChange={handleChange}
          size='8'
          required
          placeholder="Digite sua dúvida para que alguém possa responder"
        />

        <div>
          <button type="submit" className="bold">Postar dúvida</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="button" className="bold" onClick={handleSearch}><i className="fa-solid fa-globe"/> Pesquisar na internet</button>
        </div>
      </form>

      {modalOpen && (
        <Modal
          title={`Resultado da busca: "${formData.title}"`}
          onClose={() => setModalOpen(false)}
          primaryAction={() => setModalOpen(false)}
          primaryLabel="Fechar"
          secondaryLabel="null"
          source={source}
        >
          <p>{searchResult}</p>
        </Modal>
      )}
    </>
  );
}

export default QuestionForm;