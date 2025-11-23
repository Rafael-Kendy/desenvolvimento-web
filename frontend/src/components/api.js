import axios from 'axios';

const api=axios.create({
   //baseURL: "http://localhost:8000" //url do backend
     baseURL: "https://chave-digital.onrender.com" //link da hospedagem feita com o render
});

export default api;
