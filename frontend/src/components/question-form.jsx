import { useState } from "react";
import LabelField from "./label-field";

function QuestionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData); // callback to parent
    setFormData({ name: "", text: "", image: null }); // reset
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

      <button type="submit">Postar dúvida</button>
    </form>
  );
}

export default QuestionForm;