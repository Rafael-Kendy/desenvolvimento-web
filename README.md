# Plataforma de aprendizado digital - Chave Digital

## Entrega 2 - APIs

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

### FastAPI

#### Página de comunidade

Essa página serviria para exibir todas as comunidades presentes dentro da plataforma, dentro de cada comunidade o usuário poderia ver dúvidas e discussões referentes a um tópico em específico.

Para simplificar a execução do projeto, essa página mostra um carrosel de imagens que seriam referentes às comunidades criadas, abaixo desse elemento está a seção de dúvidas, que é onde escolhemos para ser uma das integrações com a FastAPI, através do seu endpoint, `/comunidade`.

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


### API externa

A API externa também foi implementada na página Comunidade, no componente `question-form.jsx`. Foram usadas 2 APIs para busca, a API DuckDuckGo e a pertencente ao Wikipedia.

Inicialmente, pretendíamos implementar apenas a API DuckDuckGo, porém tivemos dificuldade com ela, que apenas retornava resultados para perguntas específicas, não respondendo várias dúvidas. Por isso foi decido usar a API do Wikipedia e manter a DuckDuckGo como opção de fallback.

#### Wikipedia API

As duas APIs usadas seguem o mesmo princípio de funcionamento, no formulário de dúvidas, existe um botão "Pesquisar na internet", que usa o título da dúvida para fazer a pesquisa via essas APIs.

No caso da API do Wikipedia, primeiramente é feito uma busca no site usando `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`, isso deve retornar uma lista das publicações relaciados ao título da dúvida. A partir desse primeiro resultado, a primeira página da lista é escolhida, e o seu resumo é exibido em uma modal, usando `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}` para conseguir essa informação.

#### DuckDuckGo API

DuckDuckGo é um site de pesquisas, similar ao Google, essa API deveria retornar dados como resumo, tópicos relacionados e definições. As requisições são feitas via o link `https://api.duckduckgo.com/?q=${query}&format=json`.

Como dito anteriormente, encontramos alguns problemas com o uso dessa API, na maioria dos casos ela não retornava nenhum dado, conseguimos respostas apenas para questões "diretas" e em inglês, como por exemplo ao perguntar "What is HTML". Por causa disso, decidimos mantem ela como opção de fallback, sendo a API do Wikipedia a principal.




## Entrega 1 - Front End

### Instruções de instalação e execução

#### Baixando o projeto  

Antes de acessar o projeto, é primeiro necessário baixar os arquivos, para isso você pode clicar no botão "Code" e então em "Download ZIP", ou então usando o terminal, executar o comando `git clone https://github.com/Rafael-Kendy/desenvolvimento-web.git`. Caso tenha baixado o ZIP, extraia os arquivos para um pasta.

Abra o terminal dentro da pasta que você baixou, `cd {CAMINHO DA PASTA}`. 

#### Executando o HTML

Navegue para o branch HTML, `git checkout html`, em caso de dúvida use o comando `git branch -r` para mostrar o nome de todos os branches.

Você pode abrir cada página separadamente usando `start {NOME DA PÁGINA}` no Windows ou `xdg-open {NOME DA PÁGINA}`, usar `ls` na pasta do projeto irá listar todos os arquivos.

Caso você tenha python instalado em seu computador, o comando `python3 -m http.server` irá criar um servidor simples que pode ser acessado em seu navegador usando o link "http://localhost:8000". Se você possui a IDE VSCode, todo esse processo pode ser feito via o terminal dentro da IDE, além disso com a extensão Live Server, você pode clicar com o botão direito no arquivo "index.html" e em "Abrir com Live Server" para abrir o projeto automáticamente no seu navegador.

#### Executando o React

Você precisa ter instalado no seu computador node.js e npm.

Navegue para o branch React, usando `git checkout react` e a partir da pasta baixada, vá para o diretório `cd v2-comReact/projeto-ihc/`.

Execute o comando `npm install` para baixar as dependências do projeto e então `npm run dev`, isso abrirá um servidor onde você poderá acessar o projeto. Normalmente ele usa o endereço "http://localhost:5173/".




### Estrutura do projeto

Este projeto foi desenvolvido como uma plataforma de alfabetização digital, com foco em acessibilidade, colaboração e aprendizado aberto. A ideia é oferecer um ambiente simples e intuitivo, onde qualquer pessoa possa aprender a usar computadores e a internet por meio de textos, imagens, vídeos e exercícios práticos.

A plataforma seria sem fins lucrativos e de código aberto, permitindo que qualquer pessoa contribua com melhorias, correções, novas lições ou materiais complementares. Dessa forma, buscamos criar um recurso vivo e em constante evolução, apoiado pela comunidade.

Nosso GitHub possui três branches no momento.
- Main: estrutura geral do site não foi necessariamente atualizada com as outras branches, se você está lendo esta mensagem, você já está aqui.
- HTML: versão do site usando apenas HTML, CSS e JavaScript. Apenas um arquivo CSS foi utilizado, ele pode ser encontrado em "css/style.css". O arquivo JS está em "js/main.js" e é utilizado para abrir o modal do cabeçalho e carregar o cabeçalho e rodapé nas páginas que faz uso desses componentes. A pasta "assets" inclui os HTMLs desses 2 componentes, assim como as imagens e outros documentos utilizados.
- React: evolução do HTML, nele o site foi refeito usando React e JSX, dividindo as páginas em componentes e facilitando seu reúso na criação de novas páginas. Os arquivos "index.html" e "src/main.jsx" servem como porta de entrada para o site. "src/App.jsx" seria o nosso "index.html" original. As páginas ficam em "src/pages" e os componentes utilizadas nelas pode ser encontrado em "src/components".

O projeto foi desenvolvido seguindo uma certa identidade visual, com a intenção de facilitar a sua navegação, o rascunho inicial dessa identidade é visto na imagem abaixo.
![rascunho](web.png)

A divisão de tarefas entre os 3 membros da equipe foi feita de maneira em que todos tivessem um número equivalente de páginas a desenvolver.
- Hugo Massaro: telas de criação de conta, login, perfil e configurações.
- Rafael Kendy: telas inicial, sobre, equipe e diretrizes. Componentes do cabeçalho e rodapé.
- Rafael Zaupa: telas com todos os tópicos, a individual de cada tópico e todas as lições desses tópicos.

Embora essa divisão de tarefas tenha sido feita, ela serviu apenas como um guia geral, não significando que cada membro trabalhou apenas em suas páginas. Durante o desenvolvimento do projeto tentamos estar sempre em comunicação, atualizando uns aos outros em que partes estávamos trabalhando e se ajudando conforme necessário.


### Explicação de cada página e suas funcionalidades

#### index.html - Página inicial

Primeiro contato do usuário com a plataforma, possui uma breve introdução de como ela funciona e alguns dos tópicos de estudo. Através dela também é possível criar uma conta e clicando no logo do site existe um popup para ajuda básica quanto aos componentes interativos.

#### sobre.html - Sobre a Chave Digital

Explicação mais detalhada sobre nossos objetivos e como o projeto funciona. Também contém as referências usadas na criação do site e uma área para que o usuário colabore com o projeto.


#### diretrizes.html - Nossas diretrizes

Contém o enunciado referente a primeira entrega do projeto.


#### equipe.html - Nossa equipe

Breve introdução da nossa equipe que fez o desenvolvimento do site.


#### topicos_todos.html - Todos os tópicos

Porção do site onde ficarão em disposição os assuntos, mostrando alguns dos tópicos cobertos dentro de cada tema.


#### internet.html, computadores.html, mensagens.html - Tópicos individuais

Dentro de ../topics. Onde onde estão reunidos as páginas do fluxo de navegação do site a partir da escolha do tópico que o usuário deseja estudar. Aqui estão os arquivos .html referentes a cada um dos tópicos disponíveis. Os tópicos foram escolhidos para demonstração, e não serão limitados a estes.


#### pg_rede.html - Lição

Dentro de ../topics/internet, uma das lições propriamente ditas. São compostas por imagens, passo-a-passo e vídeo quando disponível, bem como as próximas lições ou próximo tópico, em ordem. A página referente a cada uma das lições pode ser encontrada na pasta de seu respectivo tópico, como em ../topics/computadores e ../topics/mensagens.

#### registro.html 

Destinada a novos usuários, essa página permite a criação de uma nova conta na plataforma. O formulário solicita informações como nome, e-mail e uma senha com confirmação. Para garantir a transparência há um link para os "termos de uso" da nossa plataforma. Também são oferecidas opções de cadastro rápido utilizando contas do Gmail ou Facebook.

#### login.html 

Página de autenticação para usuários teoricamente já registrados. Nela o usuário pode inserir seu e-mail e senha para acessar sua conta. A Também são oferecidas opções de cadastro rápido utilizando contas do Gmail ou Facebook e um link para a página de criação de conta, caso o visitante ainda não seja um membro. Após a autenticação bem-sucedida, o usuário é redirecionado para a sua página de perfil.

#### perfil.html 

Após o login o usuário é direcionado para esta página que serve como seu painel pessoal. Nela são exibidas as informações principais do usuário, como foto, nome, e-mail e uma biografia. A página é dividida em seções que mostram o progresso do usuário nos tópicos de estudo, detalhando a porcentagem concluída e o número de lições feitas. Há também uma área dedicada às postagens do usuário exibindo suas contribuições recentes. Um ícone de engrenagem permite o acesso direto a página de configurações.

#### configuracoes.html 

Nesta seção o usuário pode gerenciar e personalizar sua conta. As opções disponíveis incluem a alteração de informações como nome de usuário, foto de perfil e a descrição da biografia. Além disso a página oferece funcionalidades  como a opção de resetar progressão, que apaga todo o progresso nos tópicos, e a de deletar conta, que remove permanentemente todos os dados do usuário da plataforma.

