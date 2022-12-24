import ComfyJS from 'comfy.js';
import axios from 'axios';
import {sleep} from './helpers.js';
import {selectOption} from './browser.js';

/**
 * @var {AxiosInstance}
 */
let httpClient;

function initTwitchHttpClient() {
    httpClient = axios.create({
        baseURL: 'https://api.twitch.tv/helix',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': `Twitch Poll Creator (https://twitch.tv/${process.env.TWTICH_USERNAME})`,
            'Authorization': `Bearer ${process.env.TWITCH_OAUTH.replace('oauth:', '')}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID
        },
    });
}

export function initTwitch() {
    ComfyJS.Init(process.env.TWTICH_USERNAME, process.env.TWITCH_OAUTH);
    initTwitchHttpClient();

    getUserId(process.env.TWTICH_USERNAME).then((id) => {
        console.log(`User id for "${process.env.TWTICH_USERNAME}" is "${id}"`)
    })
}

let userId = null;

async function getUserId(login) {
    if (!userId) {
        const {data: {data}} = await httpClient.get('/users', {
            params: {login}
        });

        if (!data.length) {
            console.error(`Failed to look up info for ${login}`);
            return null;
        }

        const user = data[0];

        if (!user) {
            throw new Error('No data for twitch user, twitch api will not work!');
        }

        userId = user.id;
    }

    return userId;
}

/**
 *
 * @param {Array<string>} options
 * @returns {Promise<void>}
 */
export async function createPoll(options) {
    const userId = await getUserId(process.env.TWTICH_USERNAME);

    console.log(userId);

    const createOptions = {
        broadcaster_id: userId,
        title: 'What WikiHow article is this image from?',
        choices: options.map(choice => {
            let fixedChoice = choice;

            if (fixedChoice.length > 25) {
                fixedChoice = fixedChoice.replace('How To', '').trim();

                // Annoying
                if (fixedChoice.length > 25) {
                    const charsToRemove = fixedChoice.length - 25;

                    fixedChoice = fixedChoice.slice(0, -charsToRemove);
                }
            }

            return {
                title: fixedChoice,
            };
        }),
        channel_points_voting_enabled: true, // TODO: math
        channel_points_per_vote: 50,
        duration: 60
    };

    const { data: { data } } = await httpClient.post('/polls', createOptions);
    const pollId = data[0].id;

    sleep(60).then(async () => {
        const { data: { data } } = await httpClient.get('/polls', {
            params: {
                'broadcaster_id': userId,
                id: pollId,
            }
        });
        const pollResult = data[0];

        const choices = pollResult.choices.map((c) => ({
            ...c,
            allVotes: c.votes + c.channel_points_votes
        }))
            // sort votes descending
            .sort((a, b) => b.allVotes - a.allVotes);

        console.log(choices);

        const winner = choices[0]; // This should work
        const fullTitle = options.find((x) => x.includes(winner.title));

        selectOption(fullTitle).catch(console.error);
    });
}

export function sendPollToChat(pollId) {
    ComfyJS.Say(`VOTE HERE: https://www.strawpoll.me/${pollId}`);
}
