import person from "./assets/img/pexels-by-andrea_piacquadio.jpg";
import { Link } from 'react-router-dom';

function RegCard(){
    return (
        <regcard className="general-width">
			<div className="reg-card general-width">
				<div className="reg-text">
					<h2>Inicie seu aprendizado hoje</h2>
					<br/>
					<p>Aprenda a usar o computador e a internet de forma simples e prática, com lições acessíveis e interativas.</p>
					<p>Participe gratuitamente e comece já a explorar nossos conteúdos.</p>
					<br/>
					{/*<a href="#" className="reg-btn bold">Crie sua conta</a>*/}
					<Link to="/registro" className="reg-btn bold">Crie sua conta</Link>
				</div>
				<div>
					<img src={person} alt="Um jovem"/>
				</div>
			</div>
        </regcard>
    );
}

export default RegCard

