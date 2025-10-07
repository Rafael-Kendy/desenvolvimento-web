import {Link} from "react-router-dom";

function CardGrande({content=[], buttons=[], image=null}){
    return (
        <bigcard className="general-width">
			<div className="big-card general-width">
				<div className="bigcard-text">
					<h2>{content.title}</h2>

					{content.text.map((txt, i)=>(
						<p key={i}>{txt}</p>
					))}

					<div className="bigcard-buttons">
						{buttons.map((btn, i)=>(
							<Link key={i} to={btn.href || "#"} className="bigcard-btn bold">{btn.label}</Link>
						))}
					</div>
				</div>

				{image && (
					<div>
						<img src={image.src} alt={image.alt}/>
					</div>
				)}

			</div>
        </bigcard>
    );
}

export default CardGrande