# SGR

### Projeto Final de Desenvolvimento de Sistemas Web I

O Sistema de Gerenciamento de Residentes da Universidade Federal do Rio Grande do Norte, tem como objetivo suprir as demandas requisitadas pelos residentes da residência universitária e possibilidar que a Pró-Reitoria de Assuntos Estudantis da UFRN - PROAE, tenha controle da entrada/saída dos residentes.

## TODO

- [x] Autenticação
- [x] Validações e Tratamento de Erros
- [x] Gerenciar Residências 
- [x] Gerenciar Residentes
- [x] Gerenciar Solicitação
- [x] Solicitar Material/Serviço 
- [x] Acompanhar Solicitação
- [ ] Avaliar Solicitação Finalizada


## Tecnologias


- Bootstrap
- Node
    - Express
    - Handlebars
    - Body parser
    - Mongoose
    - Express-session
    - Connect-flash
    - Bcryptjs
    - Passport
    - Pasta helpers
- MongoDB

### Estrutura do projeto

![estrutura](estrutura.PNG)

## Para rodar o projeto

> - Instalar o Node JS em: https://nodejs.org/en/download/ 
> - Verificar instalação:

	 $ node –v

> - Instalar o MongoDB em: https://www.mongodb.com/download-center/community

> - Configurar Mongo para conseguir acessá-lo na linha de comando:

> No windows vá em Propriedades do Sistema > Variáveis de Ambiente > Seleciona "path" > Editar > Adiciona o path para pasta /bin do Mongo instalado. 

![Config image](config_path_mongo.PNG)

> Criar uma pasta em no disco local C:\ chamada "data" e, dentro dela criar uma pasta chamada "db". Nela que ficará salva todos os registros do MongoDB.

![Data DB](data_db.PNG)

> Agora, basta ir na linha de comando e abrir servidor do MongoDB:

	`$ mongod`

> Deixe o MongoDB rodando em uma janela do cmd e abra uma janela nova do cmd para acessar pasta do projeto e rodar o projeto com o Node:

	`$ cd sg_residencia`
	`$ node app.js`
![Rodar projeto](rodar_projeto.PNG)

> A partir disto, é possivel acessar o projeto em localhost:8082 no navegador.

### Criação do primeiro usuário admin
---

Como não tem nem um admin (servidor da ufrn) padrão, a rota _ localhost:8082/servidor/servidores _ vai estar acessivel sem autenticação para poder cadastrar o primeiro admin do sistema. 
O admin deve ser cadastrado com um e-mail válido, pois será necessário para definir sua senha. Com esta autententicação será possivel acessar as funcionalidades de servidor, como cadastrar um residente, para ter acesso ao portal do residente...


## Autoria
_
Edivânia Pontes de Oliveira (< *edivaniap@ufrn.edu.br* >), 
Joicy Daliane Silva Oliveira (< *joiicyoliv@gmail.com* >), 
Bryan Silva de Brito (< *bryansbritto@gmail.com* >).
_

&copy; IMD/UFRN 2019.1
