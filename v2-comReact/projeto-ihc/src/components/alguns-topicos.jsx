import www from "./assets/img/site.png";
import social from "./assets/img/social-media-hand.png";
import msg from "./assets/img/messages.png";
import cart from "./assets/img/shopping-cart.png";
import app from "./assets/img/apps.png";
import file from "./assets/img/folder-open.png";
import img from "./assets/img/picture.png";
import doc from "./assets/img/document.png";


const topics=[
	{
		category: "Internet",
		items:[
			{img: www, alt: "Sites", title: "Sites", text: "O básico para uma navegação segura."},
			{img: social, alt: "Redes sociais", title: "Redes sociais", text: "Se conecte com seus amigos."},
      		{img: msg, alt: "Mensagens", title: "Mensagens", text: "Fique sempre perto da sua família."},
      		{img: cart, alt: "Compras", title: "Compras", text: "Para pedir aquele produto que você queria."},
		]
	},
	{
		category: "Computadores",
		items:[
			{ img: app, alt: "Aplicativos", title: "Aplicativos", text: "Tudo o que você precisa no computador." },
			{ img: file, alt: "Arquivos", title: "Arquivos", text: "Como gerenciar seus arquivos." },
			{ img: img, alt: "Imagens", title: "Imagens", text: "Nunca perca uma lembrança de família." },
			{ img: doc, alt: "Documentos", title: "Documentos", text: "Anote e salve seus pensamentos." },
		]
	}
];

function AlgunsTop(){
    return(
        <algunstop className="center">
			<div className="component general-width topics">
				
				<h2>Alguns dos tópicos disponíveis</h2>
			
				{topics.map((topic)=>(
					<div key={topic.category} className="topic-section">
						<h2 className="gold">{topic.category}</h2>

						<div className="cards">
							{topic.items.map((item)=>(
								<div key={item.title} className="card-small bg-white">
									<figure>
										<img src={item.img} alt={item.alt} className="img-smaller"/>
									</figure>
									<h3>{item.title}</h3>
									<p>{item.text}</p>
								</div>	
							))}
						</div>
					</div>
				))}
			</div>
        </algunstop>
    );
}

export default AlgunsTop