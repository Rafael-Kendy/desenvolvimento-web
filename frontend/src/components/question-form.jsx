import { useState } from "react";
import LabelField from "./label-field";

function QuestionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    question: "",
    image: null,
  });

  //cuida das mudancas no input do form
  const handleChange = (e) => {
    const {name, value, files} = e.target; //pega o nome do campo, valor e arquivo se tiver, e.target seria o campo em si
    setFormData({
      ...formData,
      [name]: files? files[0] : value, //ve se e arquivo ou texto
    });
  };

  const handleSubmit=(e) => {
    e.preventDefault(); //pro navegador nao carregar
    onSubmit?.(formData); //chama a funcao onSubmit do parente, se existir, e manda o form
    setFormData({ name: "", email: "", title: "", question: "", image: null }); //reseta os campos
  };

  return (
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

      <button type="submit" className="bold">Postar dúvida</button>
    </form>
  );
}

export default QuestionForm;