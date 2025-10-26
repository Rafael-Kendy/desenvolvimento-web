import { useState, useEffect } from 'react';
import LabelField from "./label-field";
import Modal from './modal';


function QuestionForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    question: "",
    image: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState("");



  //pra pegar dados de edicao caso seja
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
  }, [initialData]);


  //cuida das mudancas no input do form
  const handleChange = (e) => {
    const {name, value, files} = e.target; //pega o nome do campo, valor e arquivo se tiver, e.target seria o campo em si
    setFormData({
      ...formData,
      [name]: files? files[0] : value, //ve se e arquivo ou texto
    });
  };


  //quando submete o formulário
  const handleSubmit=(e) => {
    e.preventDefault(); //pro navegador nao carregar
    onSubmit?.(formData); //chama a funcao onSubmit do parente, se existir, e manda o form
    setFormData({ name: "", email: "", title: "", question: "", image: null }); //reseta os campos
  };


  //pras API do duckduckgo e da wikipedia
  const handleSearch=async() => {
    if(!formData.title.trim()){
      alert("A funcionalidade de busca usa o título da dúvida, por favor digite um título antes de pesquisar.");
      return;
    }

    const query = encodeURIComponent(formData.title);

    try{
      //tenta na wikipedia primeiro, aqui faz uma busca pelo titulo da duvida
      const searchRes = await fetch(
        `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
      );
      const searchData = await searchRes.json();

      if (searchData.query.search.length > 0) {
        const firstTitle = searchData.query.search[0].title; // pega o título mais relevante
        const summaryRes = await fetch(
          `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`
        );
        const summaryData = await summaryRes.json();

        if (summaryData.extract) {
          setSearchResult(summaryData.extract);
          setModalOpen(true);
          return;
        }
      }

      ////se nao der na wikipedia, tenta pelo duckduckgo
      const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`);
      const ddgData = await ddgRes.json();

      const answer =
        ddgData.AbstractText ||
        (ddgData.RelatedTopics?.[0]?.Text ?? "") ||
        ddgData.Definition ||
        "Não foi possível encontrar uma explicação sobre o título inserido.";

      setSearchResult(answer);
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
          <button type="button" className="bold" onClick={handleSearch}>Pesquisar na internet</button>
        </div>
      </form>

      {modalOpen && (
        <Modal
          title={`Resultado da busca: "${formData.title}"`}
          onClose={() => setModalOpen(false)}
          primaryAction={() => setModalOpen(false)}
          primaryLabel="Fechar"
          secondaryLabel=""
        >
          <p>{searchResult}</p>
        </Modal>
      )}
    </>
  );
}

export default QuestionForm;