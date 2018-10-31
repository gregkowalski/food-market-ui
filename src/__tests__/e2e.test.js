import puppeteer from 'puppeteer';

describe('Order workflow', () => {

    it('loads correctly', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        let page = await browser.newPage();

        page.emulate({
            viewport: {
              width: 500,
              height: 2400
            },
            userAgent: ''
          });
      
          await page.goto('https://ui-dev-greg.cosmo-test.com:3000/');
          await page.waitForSelector('.App-title');
      
          const html = await page.$eval('.App-title', e => e.innerHTML);
          expect(html).toBe('Welcome to React');
      
          browser.close();

    }, 16000);

})