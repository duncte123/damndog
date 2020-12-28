import puppeteer from "puppeteer";

/**
 * @var {Browser}
 */
let browser;
/**
 * @var {Page}
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

    await page.goto('https://damn.dog/');
}

export function getOptions() {
    // document.querySelector('[data-display="guess"] select').options
    return page.evaluate(() => {
        const optionsSelector = document.querySelector('[data-display="guess"] select').options;

        return Array.from(optionsSelector).filter((o) => !o.disabled).map((o) => o.value);
    });
}

export async function selectOption(option) {
    await page.select('[data-display="guess"] select', option);
}

export async function nextRound() {
    //document.querySelector('.button-holder button')

    await page.click('.button-holder button');
}
