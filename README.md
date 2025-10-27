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




### Página de comunidade - Rafael Kendy


#### FastAPI

##### Post

##### Get

##### Delete

##### Put


#### API externa


#### Autenticação/autorização
