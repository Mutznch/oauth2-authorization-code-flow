import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import axios from 'axios';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { newAxios } from "../lib/network.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const BASE_PATH = `${__dirname}/../components`;

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




app.get('/', (req, res) => {
    res.render('index');
});

const code_challenge = "6sri5noetf7"
const client_id = "dm5oZ0ZMTVNZeDJsQW8zUUhOeGY6MTpjaQ";
const redirect_uri = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=http://localhost:3001/auth&scope=tweet.read%20users.read%20follows.read%20offline.access&state=spe4pnsl319&code_challenge=${code_challenge}&code_challenge_method=plain`;
const bearer = '';
let token;

app.post('/login', async (req, res) => {
    const axios = newAxios();
    axios.get(redirect_uri)
    .catch(err => console.log(err));
})

app.get('/auth', async (req, res) => {
    const code = req.query.code;
    const axios = newAxios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${bearer}`
        },
        data: {
            code,
            'grant_type':'authorization_code',
            client_id,
            redirect_uri: "http://localhost:3001/user",
            'code_verifier':code_challenge
        }
    });
    axios.post("https://api.twitter.com/2/oauth2/token")
    .catch(err => console.log(err));
});

app.get('/user', async (req, res) => {
    token = req.query.token;
    let followers;
    let following;
    const axios = newAxios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${token}`
        },
    });
    axios.get("https://api.twitter.com/2/users/:id/followers")
    .then((req, res) => {
        followers = req.data
    })
    .catch(err => console.log(err));
    axios.get("https://api.twitter.com/2/users/:id/following")
    .then((req, res) => {
        following = req.data
    })
    .catch(err => console.log(err));
    res.render("user", {followers, following});
});

app.post('/revoke', async (req, res) => {
    const axios = newAxios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${bearer}`
        },
        data: {
            token,
        }
    });
    axios.post('https://api.twitter.com/2/oauth2/revoke');
    res.redirect("http://localhost:3001");
});

export default app;