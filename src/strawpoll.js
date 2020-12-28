import axios from 'axios';

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
        // dupcheck: 'permissive',
        // captcha: true,
    });

    console.log(data);

    return data;
}

export async function loadPollResults(pollId) {
    const { data } = await strawClient.get(`/${pollId}`);
    const returnData = {};

    for (let i = 0; i < data.options.length; i++) {
        returnData[data.options[i]] = data.votes[i];
    }

    // getOptionWithMostVotes(returnData);

    return returnData;

}

export function getOptionWithMostVotes(obj) {
    const arr = Object.values(obj);
    const min = Math.min(...arr);
    const max = Math.max(...arr);

    console.log( `Min value: ${min}, max value: ${max}` );

    return Object.keys(obj).find(key => obj[key] === max);
}
