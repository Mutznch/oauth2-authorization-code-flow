# oauth2-authorization-code-flow
Feito por: Félix A. Motelevicz

Este projeto foi feito em NodeJS e acessa o TwitterAPI. Possuí ambos front e backent.<br><br>

Para executar o programa, baixe o NodeJS se ainda não possuí. Para isso, execute a sequência de comandos abaixo no terminal:

  <p>npx --package express-generator express</p>
  <p>npm install</p><br><br>

Próximo passo, na pasta deste repositório, execute o seguinte comando para baixar todas as dependências do projeto:

  npm install<br><br>
  
Agora crie um arquivo ".env" e preencha-o com as seguintes informações: (este arquivo deve ficar no raiz deste repositório)

  CODE_CHALLENGE= "numero aleatório"<br>
  CLIENT_ID= "Id cliente"<br>
  CLIENT_SECRET= "Segredo do Cliente"<br>
  REDIRECT_URI= "Uri de redirecionamento"<br><br>
  
Pronto, basta agora executar o codigo com o comando a seguir:

  npm start<br><br>
  
Após iniciado, acesse o aplicativo através deste link: "http://localhost:3001/"
