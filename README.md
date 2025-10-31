<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">API Forum</h1>

<p align="center">
  <image
  src="https://img.shields.io/github/languages/count/Tauan-Ray/BackEnd-System-Forum"
  />
  <image
  src="https://img.shields.io/github/languages/top/Tauan-Ray/BackEnd-System-Forum"
  />
  <image
  src="https://img.shields.io/github/last-commit/Tauan-Ray/BackEnd-System-Forum"
  />
</p>

# sumário

- [objetivos](#id01)
- [descrição detalhada](#id01.01)
- [tecnologias utilizadas/linguagens](#id02)
- [ambiente de codificação](#id03)
- [clonagem e instalação](#id04)
- [autoria](#id05)

# objetivos <a name="id01"></a>

Desenvolver uma API completa para um sistema de fórum focado em tecnologia, permitindo que os usuários se registrem, façam login, criem perguntas e respondam a outras perguntas. Além disso, o sistema oferece funcionalidades de likes e dislikes para as respostas.

# descrição detalhada <a name="id01.01"></a>

O objetivo deste projeto é desenvolver uma API utilizando o framework NestJS, com o Prisma como ORM para manipulação do banco de dados PostgreSQL. A API conta com endpoints que permitem a criação, visualização, atualização e exclusão de usuários, perguntas, respostas e categorias, além de um sistema de likes/dislikes para as respostas. Todas as rotas são protegidas por uma camada de autenticação baseada em JWT (JSON Web Token), garantindo o acesso apenas a usuários autenticados. Foram implementados DTOs para assegurar a integridade dos dados recebidos e enviados. O projeto inclui testes unitários desenvolvidos com o Jest, cobrindo os principais cenários de cada módulo, tanto em controllers quanto em services e alguns repositories. Além disso, a API foi totalmente documentada com o Swagger, proporcionando uma interface clara e acessível, contendo detalhes sobre os parâmetros (body, query e params), formatos de resposta, códigos de status e exemplos de retorno.

# ferramenta/linguagem utilizada <a name="id02"></a>

<div  align='center'>

![Nest](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
<br>
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white&style=for-the-badge)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)



</div>

# ambiente de codificação <a name="id03"></a>

<div  align='center'>

![vscode](https://img.shields.io/badge/VSCode-0D1117?style=for-the-badge&logo=visual%20studio%20code&logoColor=blue)
![git](https://img.shields.io/badge/GIT-0D1117?style=for-the-badge&logo=git&logoColor=red)
![github](https://img.shields.io/badge/Github-0D1117?style=for-the-badge&logo=github&logoColor=fff)
![npm](https://img.shields.io/badge/npm-0D1117?style=for-the-badge&logo=npm&logoColor=CB3837)

</div>

# clonagem e instalação <a name="id04"></a>

## Configurando o ambiente

Clone este repositório usando o comando e entre na pasta do projeto:

```
$ git clone https://github.com/Tauan-Ray/BackEnd-System-Forum.git
$ cd BackEnd-System-Forum
```

<br>

<h2>Rodando com Docker</h2>
Este projeto já possui um ambiente Docker completo, com o PostgreSQL e o backend NestJS configurados via Docker Compose

<br>
<br>

Crie um arquivo .env para configurar a variável de ambiente para realizar a conexão com o banco de dados e a atribuição da Secret Key para o JWT:

```
DATABASE_URL="postgresql://usuario:senha@postgres:5432/nome-do-banco?schema=public"
JWT_SECRET_KEY="suachavejwt"
FORUM_SERVICE_PORT=3000
```
Importante: use postgres como host do banco, pois é o nome do serviço definido no docker-compose.yml

<br>

Construa e suba os containers:

```
docker compose up --build
```

O comando vai:
- Criar a imagem do backend com base no Dockerfile
- Subir o PostgreSQL
- Rodar o servidor NestJS na porta definida no .env

<br>

Rode o seguinte comando para aplicar as migrates no seu banco de dados

```
docker exec backend-forum npx prisma migrate dev
```

<br>

Para conferir os logs gerados pelo backend rode o seguinte comando:
```
docker compose logs backend -f
```

<br>

Acesse:

API -> http://localhost:3000
<br>
Documentação Swagger -> http://localhost:3000/docs/api

<hr>

<h2>Rodando localmente (sem Docker)</h2>

<br>

Instale as dependências: Certifique-se de ter o Node.js (versão 18 ou superior) e PostgreSQL instalados em sua máquina.
```
npm install
```

<br>

Crie o arquivo .env com as variáveis de ambiente:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome-do-banco?schema=public"
JWT_SECRET_KEY="suachavejwt"
FORUM_SERVICE_PORT=3000
```

<br>

Rode as migrações do Prisma:

```
npx prisma migrate dev
```

<br>

Agora, inicie o servidor de desenvolvimento:

```
npm run start:dev
```

<br>

O servidor estará disponível em http://localhost:3000
<br>
A documentação Swagger pode ser acessada em http://localhost:3000/docs/api

# autoria <a name="id05"></a>

<h3 align='center'> @Tauan-Ray • Desenvolvedor</h3>

<div  align='center'>

[![Linkedin](https://img.shields.io/badge/LinkedIn-0D1117?style=for-the-badge&logo=linkedin&logoColor=blue)](https://www.linkedin.com/in/tauan-ray/)
<a href = "mailto:tauanray995@gmail.com">
![Gmail](https://img.shields.io/badge/Gmail-0D1117?style=for-the-badge&logo=gmail&logoColor=red)</a>
[![github](https://img.shields.io/badge/Github-0D1117?style=for-the-badge&logo=github&logoColor=fff)](https://www.github.com/Tauan-Ray)

</div>
