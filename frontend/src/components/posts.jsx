import DisplayImage from "../components/image";
import { useState } from "react";

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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 className="text-lg font-bold mb-2 text-center">
                    Confirme sua identidade
                    </h3>
                    <p className="text-sm mb-3 text-gray-600 text-center">
                    Insira o email usado ao criar esta dúvida para deletá-la.
                    </p>
                    <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border w-full p-2 rounded mb-4"
                    />
                    <div className="flex justify-between">
                    <button
                        onClick={confirmDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Deletar
                    </button>
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default Post