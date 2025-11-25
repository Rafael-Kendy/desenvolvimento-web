import axios from 'axios';

const api=axios.create({
     baseURL: "https://desenvolvimento-web-ibke.onrender.com" //url do backend
});

export default api;
