import { useEffect } from "react";
import { useState } from "react";
import Header from "../components/header";
import Footer from '../components/footer'
import CardCarousel from "../components/card-carousel";
import QuestionForm from "../components/question-form";
import api from "../components/api";
import Post from "../components/posts";

import placeHolder from "../components/assets/img/image.png";

const cards=[
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Facebook",
        text: "Solicitações de amizade, postagens, mensagens e tudo para você."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Whatsapp",
        text: "Mande mensagens e participe de grupos com seus amigos."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Email",
        text: "Aprenda a escrever emails usando qualquer gerenciador."
    },
    {
        src: placeHolder,
        alt: "Place Holder",
        title: "Arquivos",
        text: "Tire suas dúvidas sobre como guardar arquivos no computador."
    }
];

const default_post=[
    {
        src: placeHolder,
        alt: "Place Holder",
        community: "Dúvidas gerais",
        author: "Administração",
        date: "18/10/2025",
        icon: "fa-solid fa-circle-question",
        title: "Como postar uma dúvida",
        text: "Apenas preencha o formulário acima e clique no botão 'Postar dúvida' e ele aparecerá aqui em baixo para ser respondida!"
    }
];



function Comunidade(){
    //roda isso qnd a pagina carrega
    useEffect(() => {
        document.title = "ChaveDigital - Comunidade"; //nome da tab
        const fetchPosts = async()=>{ //pega os post via o get
            try{
                const response = await api.get("/comunidade");
                setPosts(response.data);
            }catch(error){
                console.error("Erro ao carregar questões:", error);
            }
        };
        fetchPosts();
    }, []);

    const [posts, setPosts] = useState([]); //onde fica as questoes na pagina


    const handleFormSubmit = async(data)=>{ //func chamada ao clicar no botao de submeter
        try{
            //caso esteja vindo de uma edicao, ele so atualiza a questao
            if(editingPost){ 
                const response = await api.put(`/comunidade/${editingPost.id}`, {
                    email: data.email,
                    name: data.name,
                    title: data.title,
                    question: data.question,
                });
                setPosts(
                    posts.map((p)=>(p.id===editingPost.id ? response.data.question : p))
                );
                setEditingPost(null); //limpa a edicao
                //alert("Dúvida atualizada com sucesso!");
            //caso de realmente estar fazendo uma duvida nova
            }else{
                const formData = new FormData(); //cria um novo objeto a partir do form
                formData.append("name", data.name); //e vai adicionado as coisas dos campos nele
                formData.append("email", data.email);
                formData.append("title", data.title);
                formData.append("question", data.question);
                if(data.image){ formData.append("image", data.image); }

                const response = await api.post("/comunidade", formData,{ //manda uma requisicao de post
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setPosts([response.data.question, ...posts]); //se der certo, adiciona a questao
                //alert("Dúvida criada com sucesso!");
            }
        }catch(error){
            console.error("Erro ao postar questão:", error);
            alert("Erro ao enviar sua dúvida. Verifique o console para mais detalhes.");
        }
    };



    const handleDelete = async(id, email)=>{ //func pra deletar questão
        try{
            await api.delete(`/comunidade/${id}`, { //mandando a request
                headers: { "Content-Type": "application/json" },
                data: { email }, //manda o email junto
            });
            setPosts(posts.filter((post) => post.id !== id)); //se der certo, ja remove ele
        }catch(error){
            if (error.response?.status === 403) {
                alert("Email incorreto! Você não pode deletar esta dúvida.");
            } else {
                console.error("Error deleting question:", error);
                alert("Erro ao excluir a dúvida.");
            }
        }
    };

    const [editingPost, setEditingPost] = useState(null); //segura os posts que estiver editando
    const handleEdit = (id, email)=>{
        const postToEdit=posts.find((p) => p.id === id); //manda o id pra ver se acha
        if(!postToEdit) return alert("Post não encontrado.");
        //caso do email tiver errado
        if(postToEdit.email !== email) return alert("Email incorreto! Você não pode editar esta dúvida.");

        setEditingPost(postToEdit); //se tiver td certo, manda pro form
    };

    const mapped_posts = [ //mapea as questoes pela api
        ...default_post,
        ...posts.map((q) => ({
        id: q.id,
        src: q.image_url || placeHolder,
        alt: "Imagem da dúvida",
        community: "Dúvidas gerais",
        author: q.name,
        date: "Hoje",
        icon: "fa-solid fa-circle-question",
        title: q.title,
        text: q.question,
        })),
    ];


    return (
        <comunidade>
            <Header activePage="community"/>

            <main>
                <div className="component general-width">
                    <h1 className="center">Comunidades</h1>
                    <h2 className="gold">Grupos recomendados</h2>
                    <CardCarousel cards={cards}/>

                    <br/>
                    <hr className="light"/>
                    
                    <h2 className="center">Dúvidas</h2>

                    <h3 className="gold">Tirar dúvida</h3>
                    <QuestionForm onSubmit={handleFormSubmit} initialData={editingPost} />

                    <br/>

                    <h3 className="gold">Dúvidas postadas</h3>
                    <Post content={mapped_posts} onDelete={handleDelete} onEdit={handleEdit}/>
                </div>
            </main>

            <Footer activePage="community"/>
        </comunidade>
    )
}

export default Comunidade