// src/components/CreateCourseForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateCoursePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // 1. Pegar o token do localStorage (igual você faz no LessonPage)
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Você precisa estar logado como admin.");
            return;
        }

        // 2. Montar o "payload" (os dados) que o backend espera
        const newCourseData = {
            title: title,
            description: description,
            image: image, // ex: "novo-curso.png"
        };

        try {
            // 3. Fazer a chamada POST com axios
            const response = await axios.post(
                'http://localhost:8000/cursos', // O seu novo endpoint
                newCourseData, // O corpo (body) da requisição
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // O header de autenticação
                    }
                }
            );

            // 4. Sucesso!
            setSuccess(`Curso "${response.data.title}" criado com sucesso!`);
            setTitle('');
            setDescription('');
            setImage('');
            
            // Opcional: navegar para a página do novo curso
            // navigate(`/cursos/${response.data.id}`);

        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError("Acesso negado. Apenas administradores podem criar cursos.");
            } else {
                setError("Erro ao criar o curso.");
            }
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            <h2>Criar Novo Curso</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Título:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Descrição:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Nome da Imagem (ex: hardware.png):</label>
                    <input 
                        type="text" 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)} 
                        required 
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>Criar Curso</button>
                
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
            </form>
        </div>
    );
}