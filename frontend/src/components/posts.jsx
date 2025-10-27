import DisplayImage from "../components/image";
import { useState } from "react";
import { useEffect } from "react";
import LabelField from "./label-field";
import Modal from "./modal";
import api from "./api"; //pra funcionar o email logado ou nao

function Post({content, onDelete, onEdit}){
    const [modalType, setModalType] = useState(null); //delete ou edit
    const [selectedId, setSelectedId] = useState(null); //id do post a ser mexido
    const [email, setEmail] = useState(""); //email pra confirmacao
    const [skipEmailCheck, setSkipEmailCheck] = useState(false); //pra pular verificacao de email


    const openModal=(type, id) => { //abre o modal, chamada qnd clica em algm icone
        const post = content.find((p) => p.id === id);
        const sameUser = loggedEmail && post && post.email===loggedEmail; //se ta logado, se o post existe e se o email e igual
        setModalType(type);
        setSelectedId(id);
        setEmail("");
        setSkipEmailCheck(sameUser); //se tiver logado, pula o email
    };

    const closeModal=() => { //fecha o modal
        setModalType(null);
        setSelectedId(null);
    };

    const confirmAction=() => { //quando clica no confirmar da modal, chama a funcao dependendo do seu tipo
        const emailToUse = skipEmailCheck ? loggedEmail : email;  //ve se pega o email da confirmacao, ou o logado
        if(modalType==="delete") onDelete(selectedId, emailToUse);
        if(modalType==="edit") onEdit(selectedId, emailToUse);
        closeModal();
    };


    //pegando info pra quando o user ta logado, usado na modal de confirmacao
    const [loggedEmail, setLoggedEmail] = useState(null);
    useEffect(()=>{
        const fetchUser=async() => {
            const token=localStorage.getItem("token"); //ve se tem token
            if(!token)return;

            try{
                const res = await api.get("/users/me", {
                    headers: {Authorization: `Bearer ${token}`},
                });//valida o token
                setLoggedEmail(res.data.email); //se tiver certo, guarda o email
            } catch (err) {
                console.error("Erro ao buscar usuário logado:", err);
            }
        };
        fetchUser();
    }, []);


    return(
        <div>
            {content.map((post)=>(
                <div key={post.title} className="post bg-lightgray">
                    <div>
                        <DisplayImage src={post.src} alt={post.alt} size="small" />
                    </div>
                    <div>
                        <div className="flex-between">                            
                            <p>
                                <i className={post.icon}></i>
                                <span className="blue bold small-font"> {post.community}. </span>
                                <span className="dark-gray smaller-font">Postado por {post.author} - {post.date}</span>
                            </p>
                            <div className="blue">
                                <i class="fa-solid fa-pen-to-square" onClick={() => openModal("edit", post.id)}></i>&nbsp;&nbsp;
                                <i className="fa-solid fa-trash" onClick={() => openModal("delete", post.id)} ></i>&nbsp;&nbsp;
                                <i class="fa-solid fa-bars"></i>
                            </div>
                        </div>
                        <p>
                            <h2>{post.title}</h2>
                            <span>{post.text}</span>
                        </p>
                    </div>
                </div>
            ))}

            {modalType && (
            <Modal
                title={modalType === "delete" ? "Confirmar exclusão" : "Confirmar edição"} //deletar ou editar
                onClose={closeModal}
                primaryAction={confirmAction}
                primaryLabel={modalType === "delete" ? "Deletar" : "Editar"} //primeiro botao do modal
            >
                {skipEmailCheck?( //se for logado, pula a confirmacao do email 
                    <p>
                        Tem certeza que deseja{" "} {modalType === "delete" ? "deletar" : "editar"} esta dúvida?
                    </p>
                ):( //precisa confirmar o email
                    <>
                        <p>
                            {modalType === "delete" ? "Insira o email usado ao criar esta dúvida para deletá-la:" : "Insira o email usado ao criar esta dúvida para editá-la:"}
                        </p>

                        <LabelField
                            icon="fa-solid fa-envelope"
                            label="E-mail"
                            name="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seuemail@exemplo.com"
                        />
                    </>
                )}
            </Modal>
            )}
        </div>
    );
}

export default Post