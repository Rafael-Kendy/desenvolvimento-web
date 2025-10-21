import DisplayImage from "../components/image";
import { useState } from "react";
import LabelField from "./label-field";

function Post({content, onDelete}){
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [email, setEmail] = useState("");

    const openModal = (id) => {
        setSelectedId(id);
        setEmail("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    const confirmDelete = () => {
        onDelete(selectedId, email);
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
                                <i class="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;
                                <i className="fa-solid fa-trash" onClick={() => openModal(post.id)} ></i>&nbsp;&nbsp;
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

            {showModal && (
            <>
                <div className="modal" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <div className="gold bold sans-serif">Confirmar exclusão</div>
                    <button
                    onClick={closeModal}
                    className="close bold"
                    aria-label="Fechar modal"
                    >
                    &times;
                    </button>
                </div>
                <div className="modal-text justify">
                    <p>Insira o email usado ao criar esta dúvida para deletá-la:</p>

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

                    <div className="modal-buttons">
                        <button onClick={confirmDelete} className="bold">
                            Deletar
                        </button>
                        <button onClick={closeModal} className="bold">
                            Cancelar
                        </button>
                    </div>
                </div>
                </div>
                <div id="overlay" onClick={closeModal}></div>
            </>
            )}
        </div>
    )
}

export default Post