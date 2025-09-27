import {useState} from "react"; //hook pra guardar estado
import {Link} from "react-router-dom"; //equivale ao <a>

function Footer({links=[], activePage}){
    return (
        <footer className="general-width">
            <div className="footer-flexbox">
                <ul>
                    <li>
                        <div className="flex-center">
                            <div className="logo-img">
                                <img src="./src/assets/img/main_logo_alt.png" alt="Logo"/>
                            </div>
                            <div className="logo-text light">
                                <span>ChaveDigital</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <p className="medium-gray">Aprenda a usar computador de forma simples e prática,<br/> com dicas e tutoriais passo a passo.</p>
                    </li>
                    <li className="icon-small">
                        <nav>
                            <a href="https://github.com/Rafael-Kendy/desenvolvimento-web/tree/main" className="icon-manual-small" target="blank">
                                <img src="./src/assets/img/git_icon.png" alt="Github"/>
                            </a>
                        </nav>
                    </li>
                </ul>

                <div className="sections">
                    <div>
                        <div className="bold">Sobre nós</div>
                        <ul>
                            <li><a className="lightblue" href="../sobre.html">Sobre</a></li>
                            <li><a className="lightblue" href="../equipe.html">Equipe</a></li>
                            <li><a className="lightblue" href="../diretrizes.html">Diretrizes</a></li>
                        </ul>
                    </div>

                    <div> 
                        <div className="bold">Ajuda</div>
                        <ul>
                            <li><a className="medium-gray" href="#">FAQ</a></li>
                            <li><a className="medium-gray" href="#">Guias da comunidade</a></li>
                            <li><a className="medium-gray" href="#">Contato</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr/>
            <p class="copyright">© DWCO8A - 2025/2. Todos os direitos bem reservados.</p>
        </footer>
    );
}

export default Footer