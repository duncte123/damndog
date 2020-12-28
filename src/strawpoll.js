import axios from 'axios';

let currentPollId;
/**
 * @var {AxiosInstance}
 */
let strawClient;

export function initStrawClient() {
    strawClient = axios.create({
        // FUCKING STRAWPOLL NEEDS WWW
        baseURL: 'https://www.strawpoll.me/api/v2/polls',
        // baseURL: 'https://httpbin.org/post',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': `Twitch Poll Creator (https://twitch.tv/${process.env.TWTICH_USERNAME})`
        },
    });
}

export async function makePoll({ options, title = 'What WikiHow article is this image from?' }) {
    const { data } = await strawClient.post('', {
        title,
        options,
        dupcheck: 'permissive',
        captcha: true,
    });

    console.log(data);

    return data;
}

export async function loadPollResults() {
    //
}
