import axios from 'axios';

const api=axios.create({
     baseURL: "http://localhost:8000", //para testes locais
     //baseURL: "https://chave-digital.onrender.com" //url do backend
});

export default api;
