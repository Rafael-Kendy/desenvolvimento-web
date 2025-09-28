import {useState} from "react"; //hook pra guardar estado
import {Link} from "react-router-dom"; //equivale ao <a>
import logo from "./assets/img/main_logo.png";
import user from "./assets/img/user_icon.png";

function Header({links=[], activePage}){
    const [isModalOpen, setModalOpen] = useState(false); //se a pop ta aberta ou nao
    const [searchValue, setSearchValue] = useState(""); //texto da busca

    const toggleModal = () => setModalOpen(!isModalOpen); //abre/fecha a modal

    return(
        <header className="general-width">
        
        {/*logo na esquerda*/}
        <div className="flex-center">
            <button onClick={toggleModal} className="logo-img" aria-label="Ajuda">
                <img src={logo} alt="Logo do Projeto" />
            </button>
            <Link to="/" className="logo-text blue">
                <span>ChaveDigital</span>
            </Link>
        </div>

        {/*parte da navegacao*/}
        <div className="flex-center right">
            <nav className="nav-links">
                <div className="flex-center">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        className="search"
                        type="search"
                        placeholder="Buscar"
                        value={searchValue}
                        onChange={(e)=>setSearchValue(e.target.value)}
                    />
                </div>
                {links.map((link)=>(
                    <Link key={link.href} to={link.href} className={activePage==link.id ? "dark":"blue"}>
                        {link.label}
                    </Link>
                ))}
                <Link to="/registro" className="icon">
                    <img src={user} alt="Perfil" />
                </Link>
            </nav>
        </div>

        {/*popup/modal*/}
        {isModalOpen &&( 
            <>
                <div className="modal" role="dialog" aria-modal="true">
                    <div className="modal-header">
                        <div className="gold bold sans-serif">Ajuda</div>
                        <button onClick={toggleModal} className="close bold" aria-label="Fechar ajuda">&times;</button>
                    </div>
                    <div className="modal-text justify">
                        <p>Este site foi desenvolvido para ser simples e fácil de usar. Usamos cores e padrões visuais que ajudam você a identificar o que pode ser clicado e a navegar com mais segurança.</p>
                        <ul>
                            <li>Textos clicáveis aparecem em <span className="blue">azul</span> e ficam <span className="red">vermelhos</span> quando o mouse passa por cima deles.</li>
                            <li>Ícones/imagens em <span className="blue">azul</span> também são clicáveis.</li>
                            <li>Campos de digitação possuem fundo <span className="bg-lightgray">&nbsp;&nbsp;cinza claro&nbsp;&nbsp;</span>, que muda para <span className="bg-green">&nbsp;&nbsp;verde&nbsp;&nbsp;</span> ao passar o mouse neles.</li>
                            <li>Textos em <span className="gold">dourado</span> são usados para atrair sua atenção, geralmente em títulos.</li>
                        </ul>
                    </div>
                </div>
                <div id="overlay" onClick={toggleModal}></div>
            </>
        )}

        </header>
    );
}

export default Header