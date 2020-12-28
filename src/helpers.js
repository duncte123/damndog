import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const sleep = (secs) => new Promise(resolve => setTimeout(resolve, secs * 1000));
