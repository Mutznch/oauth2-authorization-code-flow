import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

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

let code;
app.get('/auth', async (req, res) => {
    code = req.query.code;
    const axios = newAxios();
    axios.get()
});

export default app;