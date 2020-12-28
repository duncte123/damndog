import {__dirname, sleep} from "./helpers.js";
import express from 'express';
import { getOptions, selectOption, nextRound } from "./browser.js";
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/next-round', async function (req, res) {
    await nextRound();
    res.send('OK');
})

app.get('/start-poll', async function (req, res) {
    const options = await getOptions();

    // TODO: make poll
    await sleep(2);

    await selectOption(options[1]);

    res.send(options);
})

const port = process.env.PORT || 3000;

console.log(`Listening on http://localhost:${port}/`)
app.listen(port);
