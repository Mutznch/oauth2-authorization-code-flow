# oauth2-authorization-code-flow
Feito por: Félix A. Motelevicz

Este projeto foi feito em NodeJS. Possuí ambos front e backent.

Para executar o programa, baixe o NodeJS se ainda não possuí. Para isso, execute a sequência de comandos abaixo no terminal:

  npx --package express-generator express
  npm install

Próximo passo, na pasta deste repositório, execute o seguinte comando para baixar todas as dependências do projeto:

  npm install
  
Agora crie um arquivo ".env" e preencha-o com as seguintes informações:

  CODE_CHALLENGE= "numero aleatório"
  CLIENT_ID= "Id cliente"
  CLIENT_SECRET= "Segredo do Cliente"
  REDIRECT_URI= "Uri de redirecionamento"
  
Pronto, basta agora executar o codigo com o comando a seguir:

  npm start
  
Após iniciado, acesse o aplicativo através deste link: "http://localhost:3001/"
