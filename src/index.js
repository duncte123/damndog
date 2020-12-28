import dotenv from 'dotenv';
import { initBrowser } from './browser.js';
import './web.js';
import { initStrawClient } from './strawpoll.js';
import { initTwitch } from './twitch.js';

dotenv.config();

initStrawClient();
initBrowser();
// initTwitch();
