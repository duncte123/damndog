import puppeteer from 'puppeteer';

/**
 * @var puppeteer.Browser
 */
let browser;
/**
 * @var puppeteer.Page
 */
let page;

export async function initBrowser() {
    const width = 1920;
    const height = 1080;

    browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            `--window-size=${width},${height}`
        ]
    });
    page = (await browser.pages())[0];

    // This is well explained in the API
    await page.setViewport({
        width,
        height,
    });

    // await page.goto('https://damn.dog/');
}

export function getOptions() {
    // document.querySelector('[data-display="guess"]').firstChild.options
}
