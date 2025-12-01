import axios from 'axios';

const api=axios.create({
     baseURL: "https://chave-digital.onrender.com" //url do backend
});

export default api;
