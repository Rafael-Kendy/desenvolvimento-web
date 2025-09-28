import { Routes, Route } from "react-router-dom";

import {Link} from "react-router-dom"; //equivale ao <a>
import logo from "./assets/img/main_logo_alt.png";
import git from "./assets/img/git_icon.png";

function Footer({activePage}){
    const aboutLinks = [
        { id: "about", label: "Sobre", to: "/sobre", className: "lightblue" },
        { id: "team",label: "Equipe", to: "/equipe", className: "lightblue" },
        { id: "guidelines",label: "Diretrizes", to: "/diretrizes", className: "lightblue" }
    ];

    const helpLinks = [
        { id: "faq",label: "FAQ", to: "/faq", className: "medium-gray" },
        { id: "guides",label: "Guias da comunidade", to: "/guias", className: "medium-gray" },
        { id: "contact",label: "Contato", to: "/contato", className: "medium-gray" }
    ];

    return (
        <footer className="bg-black">
            <div className="general-width">
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
                                        <Link className={activePage==link.id ? "light":link.className} to={link.to}>
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
            </div>
        </footer>
    );
}

export default Footer