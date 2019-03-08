const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const puppeteer = require('puppeteer');
const fs = require('fs');

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));


const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true //process.env.NODE_ENV === 'production'
        }); // false : 눈에 보임

        await Promise.all(records.map(async (r, i) => {
            try {
                const page = await browser.newPage();
                await page.goto(r[1]);

                if (r[0] === 'gs25') await gs(page, r);
                if (r[0] === 'cu') await cu(page, r);
                if (r[0] === 'seven') await seven(page, r);

                await page.close();
            } catch (e) {
                console.log(e);
            }
        }));

        await browser.close();

    } catch (e) {
        console.log(e);
    }
};

const gs = async (page, r) => {
    try {
        const result = [];
        for (let i = 1; i <= 8; i++) {
            let product_title = await page.$('div:nth-child(3) > ul > li:nth-child(' + i + ') > div > p.tit');

            if (product_title) {
                const text = await page.evaluate(tag => tag.textContent, product_title);
                result.push(text.trim());
                console.error(r[0], '제품명', text.trim());
            }
        }
        await csv_save(r[0],result);
        await page.waitFor(3000);
    } catch (e) {
        console.error(e);
    }
};

const cu = async (page, r) => {
    try {

    } catch (e) {

    }
};

const seven = async (page, r) => {
    
};

const csv_save = async(fileName,result) => {
    console.log(result);
    const str = stringify(result);
    await fs.writeFileSync('csv/'+fileName+'.csv',str);
};

crawler();