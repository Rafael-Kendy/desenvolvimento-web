import { Routes, Route } from "react-router-dom";

import {Link} from "react-router-dom"; //equivale ao <a>
import logo from "./assets/img/main_logo.png";
import git from "./assets/img/git_icon.png";

import Diretrizes from '../pages/diretrizes';

function Footer({links=[], activePage}){
    const aboutLinks = [
        { label: "Sobre", to: "/sobre", className: "lightblue" },
        { label: "Equipe", to: "/equipe", className: "lightblue" },
        { label: "Diretrizes", to: "/diretrizes", className: "lightblue" }
    ];

    const helpLinks = [
        { label: "FAQ", to: "/faq", className: "medium-gray" },
        { label: "Guias da comunidade", to: "/guias", className: "medium-gray" },
        { label: "Contato", to: "/contato", className: "medium-gray" }
    ];

    return (
        <footer className="general-width">
            <div className="footer-flexbox">
                <ul>
                    <li>
                        <div className="flex-center">
                            <div className="logo-img">
                                <img src={logo} alt="Logo"/>
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
                                <img src={git} alt="Github"/>
                            </a>
                        </nav>
                    </li>
                </ul>

                <div className="sections">
                    <div>
                        <div className="bold light">Sobre nós</div>
                        <ul>
                            {aboutLinks.map((link)=>(
                                <li key={link.to}>
                                    <Link className={link.className} to={link.to}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div> 
                        <div className="bold light">Ajuda</div>
                        <ul>
                            {helpLinks.map((link)=>(
                                <li key={link.to}>
                                    <Link className={link.className} to={link.to}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <hr/>
            <p className="copyright">© DWCO8A - 2025/2. Todos os direitos bem reservados.</p>
        </footer>
    );
}

export default Footer