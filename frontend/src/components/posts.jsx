import DisplayImage from "../components/image";
import { useState } from "react";
import LabelField from "./label-field";
import Modal from "./modal";

function Post({content, onDelete, onEdit}){
    const [modalType, setModalType] = useState(null); //delete ou edit
    const [selectedId, setSelectedId] = useState(null);
    const [email, setEmail] = useState("");

    const openModal=(type, id) => {
        setModalType(type);
        setSelectedId(id);
        setEmail("");
    };

    const closeModal=() => {
        setModalType(null);
        setSelectedId(null);
    };

    const confirmAction=() => {
        if(modalType==="delete") onDelete(selectedId, email);
        if(modalType==="edit") onEdit(selectedId, email);
        closeModal();
    };

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
                    title={modalType==="delete" ? "Confirmar exclusão" : "Confirmar edição"}
                    onClose={closeModal}
                    primaryAction={confirmAction}
                    primaryLabel={modalType==="delete" ? "Deletar" : "Editar"}
                >
                <p>
                    {modalType==="delete" ? "Insira o email usado ao criar esta dúvida para deletá-la:" : "Insira o email usado ao criar esta dúvida para editá-la:"}
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
                </Modal>
            )}
        </div>
    );
}

export default Post