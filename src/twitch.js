import ComfyJS from 'comfy.js';

export function initTwitch() {
    ComfyJS.Init(process.env.TWTICH_USERNAME, process.env.TWITCH_OAUTH);
}

export function sendPollToChat(pollId) {
    ComfyJS.Say(`VOTE HERE: https://www.strawpoll.me/${pollId}`);
}
