import { __dirname } from "./helpers.js";
import express from 'express';
import { getOptions, selectOption, nextRound } from "./browser.js";
import { makePoll } from './strawpoll.js';
import { sendPollToChat } from './twitch.js';
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/next-round', async function (req, res) {
    await nextRound();
    res.send('OK');
})

app.get('/start-poll', async function (req, res) {
    res.set('Content-Type', 'application/json');

    try {
        const options = await getOptions();

        console.log(options);

        const response = await makePoll({ options });

        await sendPollToChat(response.id);

        res.send(JSON.stringify({
            success: true,
            poll: response,
        }));
    } catch (e) {
        console.error(e);
        res.send(JSON.stringify({
            success: false,
            error: e,
        }));
    }
})

app.get('/count-votes', async function (req, res) {
    res.set('Content-Type', 'application/json');

    res.send('OK');
})

const port = process.env.PORT || 3000;

console.log(`Listening on http://localhost:${port}/`)
app.listen(port);
