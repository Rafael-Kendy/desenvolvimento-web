# Plataforma de aprendizado digital - Chave Digital

## Entrega 3 - Banco de dados e hospedagem

### Guia do usuário final

O site pode ser encontrado no link: https://desenvolvimento-web-frontend.onrender.com

Na página inicial, você pode clicar no logo do site, logo ao lado da escrita ChaveDigital, isso abrirá uma janela explicando o visual básico do site, a escolha das cores foi feita para facilitar a navegação das pessoas. A partir dessa página inicial o usuário também pode acessar todas as outras páginas da plataforma.

Na página de comunidade o usuário pode postar questões e esperar que alguém o responda, ou então usar o título da dúvida para pesquisar ela na internet. A ideia é deixar o site o mais aberto possível, por isso as dúvidas podem ser postadas mesmo sem que esteja logado, devido a isso, para editar ou deletar uma dúvida já postada, o usuário deve digitar o mesmo email usado para a criação dessa dúvida.

Na página de registro, é possível criar uma nova conta preenchendo nome, e-mail e senha. O sistema garante que cada e-mail seja único e, ao concluir o cadastro, redireciona automaticamente para a entrada.

Na página de login, o usuário insere suas credenciais para acessar a área restrita do site. Uma vez autenticado, ele é levado ao seu perfil, onde pode visualizar suas informações pessoais. A foto do perfil é carregada automaticamente através de um serviço externo baseado no e-mail do usuário. Caso ele não possua uma foto, um ícone geométrico exclusivo é gerado para identificá-lo.

Na página de cursos, o usuário - quando logado - tem acesso aos tópicos aos quais as lições abrangem. Esses tópicos são clicáveis, e levam a uma lista de subtópicos que foi feita para ser seguida de maneira incremental: o usuário deve começar pelo primeiro, e o conhecimento vai acumulando conforme passa o tempo. Vale perceber que existe uma configuração não acessível ao usuário que acaba de criar uma nova conta - a de usuário premium. Ela faz com que o usuário seja capaz de deletar lições e, caso tenha acesso ao Swagger, gerar conteúdos de lições novas, mas nunca subtópicos novos, pois o fluxo do site é considerado importante. Também há um exemplo (o tópico 3 - mensagens) de assunto que é destinado apenas a usuários premium, fazendo menção a um serviço de inscrição pago.

Nas páginas de subtópicos, pode ser salvo o progresso do usuário. Cada lição que ele clicar marcará a checkbox, sinalizando que já foi realizada; essas lições são guardadas por usuário, e permanecem mesmo se o mesmo trocar de página.

Nas páginas de lições, haverão tópicos gerados automaticamente pelo Gemini: dão um geral, claro e conciso, do tema desejado. Também será fornecido, quando possível, um vídeo pertinente, que o usuário pode assistir antes de prosseguir à parte escrita das lições.

Na página de configurações o usuário tem total controle sobre seus dados. Ele pode atualizar seu nome de exibição e editar sua biografia a qualquer momento. Além disso, se desejar deixar a plataforma, existe a opção de deletar conta, que, após uma confirmação de segurança, remove permanentemente todos os seus dados do sistema.

No rodapé de qualquer site, o usuário consegue acesso a esse repositório, clicando no ícone do GitHub, na esquerda da página. Ele também tem acesso a 3 páginas sobre o projeto. Lá ele pode ver o objetivo geral do site em 'Sobre', conhecer nossa equipe em 'Equipe' e as diretrizes usadas na criação do site, 'Diretrizes'.




### Integração com banco de dados

#### Página de comunidade - Rafael Kendy

##### Post

Pelo formulário "Tirar dúvida", referente ao componente `question-form.jsx`. Ao clicar no botão "Postar Dúvida" esses dados são enviados via o método `post` da API e ficam salvas no banco de dados, mesmo que a execução seja interrompida, as dúvidas não serão perdidas. 

##### Get

Retorna as dúvidas para exibir em "Dúvidas postadas". A primeira dúvida dessa seção, fica sempre salva no banco para ser um guia para o usuário. são carregadas e mapeiadas para serem usados no componente `posts.jsx`.

##### Delete

Ao clicar no ícone de leixeira, uma modal é aberta. Nela o usuário precisa digitar o mesmo email usado na criação na dúvida, para então a ação de `delete` ser feita. Uma busca é feita usando o ID da dúvida, que é deletada se encontrada.

##### Put

Ao fazer a confirmação do email, como no `delete`, os dados da questão são carregados no formulário, durante esse tempo o sistema "segura" os dados originais.
Quando o usuário clica no botão para postar a dúvida, a função na página de Comunidade reconhece que esse clique veio de uma edição, então chama o método `put` para atualizar a questão, essa busca no banco de dados também é feito pelo ID dela,.


#### Páginas de autenticação e perfil - Hugo Massaro

##### Post

No formulário de criação de conta, `registro.jsx`, os dados são enviados para a API. O backend verifica no banco de dados se o email já existe, select. Se não existir, a senha é criptografada e o novo usuário é salvo permanentemente na tabela User usando session.add e session.commit. 

No formulário de login, `login.jsx`, o sistema busca o usuário no banco de dados pelo email. Se a senha bater com o hash salvo, um token JWT é gerado e retornado para autenticar o usuário nas próximas sessões.

##### Get

Utilizado na página de perfil, `perfil.jsx`. Ao acessar a página, o sistema envia o token JWT do usuário, o backend valida esse token, busca os dados atualizados do usuário no banco de dados select(User) e retorna as informações para preencher a tela dinamicamente, substituindo todo o conteúdo estático.

##### Delete

Utilizado na opção "Deletar Conta". Por segurança, exige confirmação. O backend identifica o usuário pelo token, localiza o registro correspondente no banco de dados e executa a remoção da linha session.delete. Após o sucesso, o usuário é deslogado e redirecionado para o início.

##### Put

Utilizado na página de configurações, `configuracoes.jsx` para editar o perfil. O usuário pode alterar seu nome ou biografia. Ao salvar, os novos dados são enviados para a API. O backend localiza o usuário no banco através do token, atualiza os campos na tabela e confirma a transação com session.commit. Ao retornar ao perfil os dados novos já são carregados do banco.


#### Página de cursos - Rafael Zaupa Watanabe

##### Post

Utilizado na porção de geração de conteúdo via genAI (Gemini), o post serve para preencher os conteúdos das lições, dado que o usuário seja um admin. A parte preenchida é exclusivamente a de texto (o vídeo permanece separado) e o prompt usado pode ser encontrado no site. A utilização da API do Google entrou no lugar da anteriormente implementada (entrega 2) pois a outra foi considerada muito simples. Como o fluxo do site é essencial, não demos autoridade ao admin de criar subtópicos novos.

##### Get

Como em ler conteúdo da lição. Busca os detalhes de uma lição, incluindo os passos gerados pela IA e a lógica de qual é a próxima aula sugerida, para que seja utilizada na lista de próximas aulas no fim da página.

##### Delete

Para deletar uma lição, que ao ser gerada por IA construa coisas impróprias ou incorretas, ou em casos de "emergência" em geral, como manutenções às pressas. É uma ferramenta exclusiva de admins (usuários premium, sinônimos a nível de teste), deletando primeiro os passos da lição, desvinculando o progresso do usuário e então removendo o subtópico.

##### Put

Para atualizar o status de conclusão de uma aula para um usuário logado (marcar como visto/não visto). Requer token do usuário logado, além de que, sem isso, ele não deve ser capaz de acessar as páginas de curso. O endpoint alterna o estado de conclusão. Se estava incompleto, marca como completo e vice-versa.



### Hospedagem

A hospedagem foi feita usando a plataforma Render (https://render.com/). Plataforma de uso gratuito, porém limitada, após 15 minutos de inatividade o site entra em modo sleep. Devido a essa limitação, os dados do banco de dados são perdidos quando o backend é inativado.

Link para o frontend: https://desenvolvimento-web-frontend.onrender.com
Link para o backend: https://chave-digital.onrender.com/




<!--
## Entrega 2 - APIs

Link para o drive com os vídeos e slides em PDF: https://drive.google.com/drive/u/1/folders/1plhqkK0ybvU141FTmoKz5iFKDRcI79YZ

Link para o canva: https://www.canva.com/design/DAG260DxQh8/JWE_WQh98XpdgZL7znvIWA/edit?utm_content=DAG260DxQh8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Os vídeos e slides também estão presentes nessa branch, dentro da pasta 'arquivos-entrega2', os códigos para esta entrega estão nas pastas `backend` e `frontend`, sendo os endpoints no arquivo `backend/api/main.py`.

### Instruções de instalação e execução

A totalidade dessa entrega está na branch main deste repositório.

Antes de acessar o projeto, é primeiro necessário baixar os arquivos, para isso você pode clicar no botão "Code" e então em "Download ZIP", ou então usando o terminal, executar o comando `git clone https://github.com/Rafael-Kendy/desenvolvimento-web.git`. Caso tenha baixado o ZIP, extraia os arquivos para um pasta.

Abra o terminal dentro da pasta que você baixou, `cd {CAMINHO DA PASTA}`.

#### Executando o backend

Navegue até a pasta `backend`. Este projeto foi feito utilizando um ambiente virtual python, para ativá-lo use `env\Scripts\activate.bat` no Windows ou `source env/bin/activate` no Linux. O prefixo `(env)` deve aparecer na sua linha do terminal.

Com o ambiente ativado, use `pip install -r requirements.txt` para instalar os requisitos do projeto e então, `uvicorn api.main:app --reload` para executar o projeto. Isso deve abrir o servidor no endereço `http://127.0.0.1:8000`, adicionando `/docs` à URL leva ao Swagger criado automaticamente pela FastAPI, contendo os endpoints e métodos implementados.

#### Executando o frontend

Você precisa ter instalado no seu computador node.js e npm.

Navegue para o diretório frontend e execute o comando `npm install` para baixar as dependências do projeto e então `npm run dev`, isso abrirá um servidor onde você poderá acessar o projeto. Normalmente ele usa o endereço "http://localhost:5173/".

Para o site funcionar em sua totalidade, o front e backend precisam estar ativos ao mesmo tempo.





### Página de comunidade - Rafael Kendy

Essa página serviria para exibir todas as comunidades presentes dentro da plataforma, dentro de cada comunidade o usuário poderia ver dúvidas e discussões referentes a um tópico em específico.

Para simplificar a execução do projeto, essa página mostra um carrosel de imagens que seriam referentes às comunidades criadas, abaixo desse elemento está a seção de dúvidas, que é onde escolhemos para ser uma das integrações com a FastAPI, através do seu endpoint, `/comunidade`.


#### FastAPI

##### Post

Através do formulário "Tirar dúvida", referente ao componente `question-form.jsx`, o usuário consegue inserir uma questão preenchendo os campos do formulário. Ao clicar no botão "Postar Dúvida" esses dados são enviados via o método `post` da API e ficam salvos na memória do servidor, caso a execução seja interrompida, essas dúvidas são perdidas. 

##### Get

Ao submeter uma dúvida, ela aparecerá logo embaixo, em "Dúvidas postadas".

A primeira dúvida dessa seção, "Como postar uma dúvida", é fixa e serve como um guia para o usuário. As dúvidas postadas aparecerão abaixo dela, sendo carregadas através do método `get`, que carrega os dados e mapeia eles para serem usados no componente `posts.jsx`.

##### Delete

Cada dúvida possui 3 ícones no topo do elemento, o ícone de lixeira serve para deletar a dúvida, usando o método `delete`.

Para implementar algum tipo de autentificação básica e ao mesmo tempo permitir testes simples e rápidos da funcionalidade, ao clicar nesse ícone uma modal é aberta. Nela o usuário precisa digitar o mesmo email usado na criação na dúvida, para então a ação de `delete` ser feita.

Essa deleção é feita pelo ID da dúvida.

##### Put

Usada para editar a dúvida, clicando no ícone de edição do componente.

Similar ao `delete`, antes de chamar a função `put` em si, o usuário precisa primeiro confirmar o email de criação da dúvida. Ao fazer essa confirmação, os dados da questão são carregados no formulário, durante esse tempo o sistema "segura" os dados originais.

Quando o usuário clica no botão para postar a dúvida, a função na página de Comunidade reconhece que esse clique veio de uma edição, então chama o método `put` para atualizar a questão, isso também é feito pelo ID dela.


#### API externa

A API externa também foi implementada na página Comunidade, no componente `question-form.jsx`. Foram usadas 2 APIs para busca, a API DuckDuckGo e a pertencente ao Wikipedia.

Inicialmente, pretendíamos implementar apenas a API DuckDuckGo, porém tivemos dificuldade com ela, que apenas retornava resultados para perguntas específicas, não respondendo várias dúvidas. Por isso foi decido usar a API do Wikipedia e manter a DuckDuckGo como opção de fallback.

##### Wikipedia API

As duas APIs usadas seguem o mesmo princípio de funcionamento, no formulário de dúvidas, existe um botão "Pesquisar na internet", que usa o título da dúvida para fazer a pesquisa via essas APIs.

No caso da API do Wikipedia, primeiramente é feito uma busca no site usando `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`, isso deve retornar uma lista das publicações relaciados ao título da dúvida. A partir desse primeiro resultado, a primeira página da lista é escolhida, e o seu resumo é exibido em uma modal, usando `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}` para conseguir essa informação.

##### DuckDuckGo API

DuckDuckGo é um site de pesquisas, similar ao Google, essa API deveria retornar dados como resumo, tópicos relacionados e definições. As requisições são feitas via o link `https://api.duckduckgo.com/?q=${query}&format=json`.

Como dito anteriormente, encontramos alguns problemas com o uso dessa API, na maioria dos casos ela não retornava nenhum dado, conseguimos respostas apenas para questões "diretas" e em inglês, como por exemplo ao perguntar "What is HTML". Por causa disso, decidimos mantem ela como opção de fallback, sendo a API do Wikipedia a principal.


#### Autenticação/autorização

Como o desenvolvimento do site foi feito em paralelo entre os integrantes, foi decidido adicionar um pouco de isolamento da página de comunidade quanto a autenticação e autorização, para facilitar testes e não ficar com o desenvolvimento em espera. 

Isto é, as dúvidas foram feitas de tal maneira que qualquer usuário, logado ou não possa edita-las, mesmo isso sendo um grande risco de segurança em um sistema real. Para adicionar um nível de segurança o usuário precisa digitar o email usado na criação da dúvida para liberar a ação. Caso o usuário esteja logado, o sistema autentifica seu token e faz uma comparação entre seu email e o de criação da dúvida, caso sejam o mesmo a janela modal pede apenas um clique de confirmação, caso contrário ainda é preciso digitar o email para comparação, isso vale para edição e exclusão.

Outra mudança que ocorre com usuários logados é que os campos "Nome" e "Email" no formulário de dúvidas é preenchido automaticamente.


***


### Página de Usuário - Hugo Antonio Massaro

Essa seção é responsável pelo gerenciamento dos usuários, abrangendo sua criação como um todo: registro, login, vizualização do perfil, atualização dos dados e exclusão da conta. As páginas desenvolvidas foram `registro.jsx`, `login.jsx`, `perfil.jsx` e `configuracoes.jsx`, que foram integradas com endpoints na fastAPI. 


#### FastAPI

Criou-se 5 endpoints principais na `main.py` para gerenciar o usuario, cobrindo os endpoints essenciais: `POST, GET, DELETE E PUT`.

##### Post

`/registro`: no frontend o componente `registro.jsx`  usa o hook useState para criar estados controlados como name, email, password. Na submissão, handleSubmit, ele chama a `api.post("/registro", ...)` enviando um objeto JSON com os dados dos estados, o resultado é recebido na variável response. 

No backend a fastAPI recebe o JSON e o valida automaticamente no modelo UserCreate. O endpoint primeiro verifica se o email ja existe na lista users, retornando um erro 400 se for duplicado. A senha é criptografada com hash usando pwd_context.hash(user_data.password). Um objeto user é criado e adicionado a lista com users.append(new_user), e é retornado ao frontend.


`/token`: é um endpoint de autenticação, no frontend o `login.jsx` também usa useState para os campos email e password. Como o backend espera o formato de formulário, o handleLogin cria um URLSearchParams. O estado email é mapeado para a chave username (params.append('username', email)) para ser compatível com o fluxo do OAuth2.

No backend usa a dependência Annotated[OAuth2PasswordRequestForm, Depends()] para receber os dados do formulário na variável form_data. A lógica então chama get_user(form_data.username) para encontrar o usuário na lista users e em seguida, valida a senha com pwd_context.verify(form_data.password, user.hashed_password). Se ambos forem válidos um token JWT é gerado pela função create_access_token, que armazena a identidade do usuário no campo data={"sub": user.email}, e token é retornado ao frontend.


##### Get

`/users/me`: é um endpoint de autorização. No frontend `perfil.jsx` e `configuracoes.jsx` usam o hook useEffect para chamar `api.get("/users/me")` na inicialização. A chamada envia o token, lido do localStorage  no cabeçalho headers: { Authorization: \Bearer ${token}` }. Os dados recebidos e filtrados pelo response_model=UserPublic são armazenados no estado setUser(response.data) e usados para preencher o JSX, como o {user.name}.

No backend o endpoint é protegido pela dependência current_user: Annotated[User, Depends(get_current_active_user)]. Essa dependência get_current_active_user é a função de segurança que valida o token JWT, se a validação for bem sucedida, a função read_users_me recebe o objeto current_user completo


##### Delete

`/users/me`: outro endpoint de autorização, no frontend a função handleDeleteAccount em `configuracoes.jsx` é chamada pelo onClick do botão "Deletar Conta". Ela chama a `api.delete("/users/me")`, enviando o token no cabeçalho Authorization. Ao receber a resposta de sucesso o frontend limpa o localStorage.removeItem("token") e redireciona para `/login`.

No backend também há proteção pela dependência Depends(get_current_active_user). Se o token for válido, o current_user colocado é removido da lista users através do users.remove(current_user).


##### Put

`/users/me`: mais um endpoint de autorização, no frontend a página configuracoes.jsx primeiro usa useEffect para buscar(GET) os dados e preencher os estados name e description. O handleSubmit então chama `api.put("/users/me", ...)`, enviando os novos dados dos estados (name, description) como corpo e o token como cabeçalho Authorization.

No backend o endpoint usa duas fontes de dados o JSON do corpo, validado no modelo user_update: UserUpdate, e o token do cabeçalho validado pela dependência Depends(get_current_active_user). Os dados são misturados, aplicando as atualizações de user_update, como por exemplo user_update.name, ao objeto current_user, como por exemplo current_user.name = user_update.name. O current_user atualizado é retornado.


#### API externa

A integração da API externa foi implementada no backend, dentro do endpoint `GET /users/me`, para substituir a foto de perfil estática por avatares mais dinâmicos. A API escolhida foi a Gravatar, que é pública e não exige chave de autenticação, ela gera uma imagem de perfil a partir de um hash do email do usuário.

Sobre a implementação no backend, inves de uma chamada fetch, a integração consiste em construir uma URL de API. Dentro do read_users_me, o email do usuário (current_user.email) é normalizado (.lower().strip()) e então hasheado usando a biblioteca hashlib (hashlib.md5(email_address.encode('utf-8')).hexdigest()).

O md5_hash é inserido em uma f-string para construir a URL da API: `f"https://www.gravatar.com/avatar/{md5_hash}?d=identicon"`. O parâmetro d=identicon instrui a API externa a gerar um ícone geométrico caso nenhum avatar esteja associado ao email.

Esse avatar é salvo em avatar_url e adicionado ao modelo de resposta UserPublic que é enviado ao frontend. O `perfil.jsx` recebe este user.avatar_url via setUser(response.data) e o insere diretamente no src da tag <img>.


#### Autenticação/autorização

Autenticação:  o usuário insere email e senha, o frontend `login.jsx` envia um `POST` para `/token`, o backend verifica as credenciais form_data.username, form_data.password da lista users usando pwd_context.verify. A autenticação é um token JWT, criado com create_access_token, se tudo der certo o backend gera um token JWT e o retorna ao frontend, onde é armazenado em localStorage.setitem("token",..).

Autorização: no frontend todas as chamadas protegidas em `perfil.jsx` e `configuracoes.jsx` leem o token do localStorage e o jogam no cabeçalho headers: { Authorization: \Bearer ${token}` }`. 

No backend o oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") é definido, a função de segurança get_current_active_user usa Depends(oauth2_scheme) para pegar o token. O get_current_active_user usa jwt.decode(token, SECRET_KEY, ...) para validar a assinatura e a quando o token expira. Ele extrai a identidade do usuário do payload.get("sub").

Se a validação do token falhar, o get_current_active_user levanta uma HTTPException 401 Unauthorized, bloqueando o acesso. O frontend `perfil.jsx` e `configuracoes.jsx` captura esse erro 401, remove o token inválido (localStorage.removeItem), e redireciona o usuário para o `/login` completando o fluxo de proteção de rota.


### Páginas de cursos - Rafael Zaupa Watanabe

Seção onde encontram-se os tópicos propriamente ditos. Contém uma página com todos os tópicos, que leva a uma lista de checkboxes com os assuntos individuais, onde cada item é uma lição sobre um assunto específico. Nenhuma parte desta porção do fluxo deve ser acessada por usuários que não estejam logados.

#### FastAPI
Foram criados endpoints para lidar com os cursos dinamicamente, e também para manter o tracking do progresso do usuário, bem como as funções de criar e deletar cursos para ADMINs.

##### Post
create_new_course - função reservada para admin. Como os cursos devem ser acessados e lidos a partir de um banco de dados, e atualmente estamos usando da memória, foi considerada redundante a demonstração da criação de um curso novo, já que no momento não existe a opção de se tornar um usuário premium (admin). Porém, inserir http://localhost:5173/admin/criar-curso deve exibir uma tela básica, demonstrando a implementação. Atualmente está desprotegido devido ao fato de que não é acessível pelo fluxo normal do site. Foi criada a página especificamente para conciliar a existência do POST.

##### Get
Vários endpoints: acesso à pagina com todos os tópicos (endpoint cursos GET), acesso à página do tópico escolhido (endpoint cursos especificos GET) e acesso à página da lição escolhida (endpoint GET lesson content). Utilizado para a lista de checkbox de forma a manter o progresso do usuário (endpoint de checkbox GET).

##### Delete
delete_lesson - função reservada para admin. Como a quantia de cursos não foi prevista para ser dinamicamente alterada com frequência, a parte "D" do CRUD foi implementada de maneira a ser acessível apenas a usuários premium - no momento sinônimos a ADMINs. O que o DELETE dos cursos faz é retirá-lo da lista de cursos, simplesmente.

##### Put
Utilizado em (endpoint de salvar progresso da checkbox PUT) para que o usuário seja capaz de controlar o estado da checkbox, seja marcando-a ou desmarcando-a, e lembrando da escolha por meio da conta enquanto o backend não sofrer refresh. Assim, ao atualizar a página, a opção marcada continua.

#### API externa
O uso da API externa é realizado para que sejam selecionados dinamicamente os ícones das lições. Ele usa de uma chave de API secreta, que deve ser adquirida da seguinte maneira:
1. Login em https://unsplash.com/developers.
2. Your Apps -> New Application
3. Aceite os termos
4. Role até a seção "Keys" e obtenha a Access Key.
   
Demo limita a 50 requisições por hora.

#### Autenticação/autorização
Autenticação é utilizada em todo o percurso do usuário pela página de tópicos, cursos e lições. Caso o usuário não esteja logado, ele não tem direito de visualizar nenhum desses conteúdos, sendo "expulso" de volta à tela de login. Ao expirar a sessão do usuário também é disparado como error response, realizando o mesmo tratamento.
Autorização foi implementada por meio da existência do "usuário premium". A nível lógico, no momento, um usuário premium é sinônimo de um ADMIN, provisoriamente; um dos cursos, o de "Chamadas", é acessível apenas a usuários premium e não pode ser acessado por usuários free. Tentativas de acessar quaisquer cursos via suas respectivas URLs sem ter a devida autorização devem resultar em barramento e o devido tratamento, seja erro 401 ou 403, e redirecionamento como supramencionado.
-->
