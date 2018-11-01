import puppeteer from 'puppeteer';
import Dom from '../Dom'

const Config = {
    dev: {
        baseUrl: 'http://localhost:3000/',
        buyer_email: 'gregkowalski+1@gmail.com',
        buyer_pwd: 'Password1',
        headless: false,
    },
    test: {
        baseUrl: 'https://www.cosmo-test.com/',
        buyer_email: 'buyer1@cosmo-test.com',
        buyer_pwd: 'N:&U5G.e>LqQy6vg',
        cook_email: 'cook1@cosmo-test.com',
        cook_pwd: 'B!"Q&=q(]S[9YBhn',
        headless: true,
        args: ['--no-sandbox']
    },
}

let env = process.env.CI_ENV;
if (!env) {
    env = 'dev';
}

const config = Config[env];
if (!config) {
    throw new Error(`Unable to find e2e test configuration named '${env}'`);
}

describe('Order workflow', () => {

    const baseUrl = config.baseUrl;
    const buyer_email = config.buyer_email;
    const buyer_pwd = config.buyer_pwd;
    const headless = config.headless;
    const delay = headless ? 0 : 15;
    const jestTimeout = 60000;

    const button = (id) => {
        return `button[data-qa=${id}]`;
    }

    const input = (id) => {
        return `input[data-qa=${id}]`;
    }

    const div = (id) => {
        return `div[data-qa=${id}]`;
    }

    const drawer = (child) => {
        return `.drawer-outer > .drawer-inner > .drawer-main ${child}`;
    }

    it('correctly creates an order', async () => {
        jest.setTimeout(jestTimeout);

        let args = [
            '--window-position=10,10',
            '--window-size=900,1000'
        ];
        if (config.args) {
            args = args.concat(config.args);
        }
        const defaultViewport = {
            width: 900,
            height: 900
        };

        const browser = await puppeteer.launch({ headless, defaultViewport, args });
        // const page = await browser.newPage();
        const page = (await browser.pages())[0];

        try {
            await page.goto(baseUrl);

            await page.waitForSelector(Dom.CognitoLogin.username_selector);
            await page.type(Dom.CognitoLogin.username_selector, buyer_email, { delay });
            await page.type(Dom.CognitoLogin.pwd_selector, buyer_pwd, { delay });

            const signin_button = await page.$(Dom.CognitoLogin.signin_selector);
            await signin_button.click();

            const findFoodNearMe_button = button(Dom.Home.findFoodNearMe);
            const address_input = input(Dom.Home.address);
            await page.waitForSelector(address_input);
            await page.type(address_input, '1265 Burnaby St', { delay });
            await page.waitFor(750);
            await page.keyboard.press('ArrowDown', { delay });
            await page.keyboard.press('Enter', { delay });
            await page.waitFor(200);
            await page.click(findFoodNearMe_button);

            await page.waitFor(1000);

            const food_link = await page.waitForSelector('div.foodgrid-card a[target=_blank]');
            await page.evaluate(x => {
                return x.setAttribute('target', '_self');
            }, food_link);
            await food_link.click();

            await page.waitFor(2000);

            const requestOrder = await page.waitForSelector(button(Dom.FoodDetail.mobileRequestOrder));
            await requestOrder.click();

            await page.waitFor(2000);

            const deliveryButton = await page.waitForSelector(drawer(button(Dom.FoodDetail.deliveryButton)));
            await deliveryButton.click();

            const increment = await page.waitForSelector(drawer(button(Dom.FoodDetail.incrementQuantity)));
            await increment.click()
            await increment.click();

            const dateSelector = await page.$(drawer('.datetimeselector-date input#date'));
            await dateSelector.click();

            const dayButton = await page.$(drawer('.CalendarDay--valid button.CalendarDay__button'));
            await dayButton.click();

            const timeDropdown = await page.$(drawer(div(Dom.FoodDetail.timeDropdown)));
            await timeDropdown.click();

            await deliveryButton.focus();
            await page.waitFor(500);

            const confirmOrder = await page.$(drawer(button(Dom.FoodDetail.mobileConfirmOrder)));
            await confirmOrder.click();

            const frame$ = async (selector) => {
                const frames = page.frames();
                for (let i = 0; i < frames.length; i++) {
                    const frame = frames[i];
                    const element = await frame.$(selector);
                    if (element) {
                        return element;
                    }
                }
                return null;
            }

            await page.waitFor(1500);
            const cardnumber = await frame$(Dom.Order.cardnumber_selector);
            await cardnumber.type('4242424242424242', { delay: 20 });

            const exp_month = await frame$(Dom.Order.exp_month_selector);
            await exp_month.type('10', { delay });

            const exp_year = await frame$(Dom.Order.exp_year_selector);
            await exp_year.type('30', { delay });

            const cvc = await frame$(Dom.Order.cvc_selector);
            await cvc.type('123', { delay });

            const cardname = await page.waitForSelector(Dom.Order.cardname_selector);
            await cardname.type('Some champ', { delay });

            const postalcode = await frame$(Dom.Order.postalcode_selector);
            await postalcode.type('12345', { delay });

            const userAgreeCheckbox = await page.$(div(Dom.Order.userAgreeCheckbox));
            await userAgreeCheckbox.click();

            const orderConfirmButton = await page.$(button(Dom.Order.confirmButton));
            await orderConfirmButton.click();

            await page.waitForSelector(div(Dom.OrderSuccess.takeMeHome));

            if (!headless) {
                await page.waitFor(1000);
            }
        }
        catch (ex) {
            console.error(ex);
            page.screenshot({ path: 'e2e-test-fail-screenshot.png' });
            fail(new Error('End-to-end test failed!!!'));
        }
        finally {
            browser.close();
        }

        //   const html = await page.$eval('.App-title', e => e.innerHTML);
        //   expect(html).toBe('Welcome to React');
    });

})