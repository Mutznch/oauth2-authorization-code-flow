import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import axios from 'axios';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const MORGAN_FMT = ":remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms - :user-agent";

app.use(logger(MORGAN_FMT, {
    skip: (req, res) => {
        req.url.includes("healthCheck") && (res.statusCode == 200 || res.statusCode == 304)
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(`${__dirname}/../public`));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/../templates`);


const code_challenge = process.env.CODE_CHALLENGE;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const auth_link = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=spe4pnsl319&code_challenge=${code_challenge}&code_challenge_method=plain`;

const encodedClient = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

let userId;
let name;
let username;
let token;

//Renderiza a primeira pagina
app.get('/', (req, res) => {
    res.render('index', {link: auth_link});
});


//Redireciona o usuario para a pagina de autorização
app.get('/login', async (req, res) => {
    res.redirect(auth_link);
})

//Recebe Authorization Code e solicita o Access Token do usuário
app.get('/auth', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post(`https://api.twitter.com/2/oauth2/token`, {
            code,
            grant_type: 'authorization_code',
            redirect_uri: "http://localhost:3001/auth",
            code_verifier: code_challenge
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedClient}`
            }
        });
        token = response.data.access_token;
        res.redirect("/user")
    } catch (err) {
        console.log(err);
    }
});

//Recebe o Access Token e busca informações do usuário
app.get('/user', async (req, res) => {
    await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then((response) => {
        userId = response.data.data.id;
        name = response.data.data.name;
        username = response.data.data.username;
    })
    .catch((error) => {
        console.error(error);
    });

    res.redirect("http://localhost:3001/user/about");
});

//Renderiza página com informações do usuário
app.get("/user/about", (req, res) =>{
    res.render("user", {username, userId, name});
})

export default app;