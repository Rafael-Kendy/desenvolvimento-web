import DisplayImage from "../components/image";

function Post({content}){
    return(
        <div className="bg-lightgray">
            {content.map((post)=>(
                <div key={post.title} className="post">
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
                                <i class="fa-solid fa-trash"></i>&nbsp;&nbsp;
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
        </div>
    )
}

export default Post