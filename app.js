const {
    load
} = require('cheerio');
const cheerio = require('cheerio');
const got = require('got');
const request = require('request');

// const url = 'https://www.binance.com/en/trade/BTC_BUSD';

let prices = [];
let emoji = '';
let netChange = 0;

// const loadPage = () => {
//     got(url).then(res => {
//         const $ = cheerio.load(res.body);
//         $('.css-8t380c').each((i, el) => {
//             console.log('RAN');
//             console.log(i, el);
//         })
//     }).catch(err => console.log('err: ', err));
// }

// loadPage();

setInterval(() => {
    getPrice();
}, 3000)

const getPrice = () => {
    request.get('https://www.bitstamp.net/api-internal/market/tickers/', {},
        async (err, res, body) => {
            if (err) {
                console.log(err);
                return
            }
            console.log(res.statusCode);
            let data = res.body;
            let _d = JSON.parse(data);
            let price = _d['data'][0]['last'];
            let index = prices.length;
            let lastPrice = prices[index - 1];
            if (price == lastPrice) {
                console.log('Same price as previous GET, ignoring.')
            } else {
                prices = [...prices, price]
                if (price > lastPrice) {
                    netChange = price - lastPrice;
                    emoji = '🚀🟢🚀';
                } else {
                    netChange = price - lastPrice;
                    emoji = '🏴‍☠️🔴🏴‍☠️';
                }
                await postPriceToDisc(price);
            }
            console.table(prices);
        })
}

const postPriceToDisc = async (price) => {
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    request.post('https://discord.com/api/webhooks/811002933289418833/ssuqiQeqQwAkEdksYeR0YPAAe-bHV0aUWfaeb6A_CEbO96KEP-8Zi5lxQYZHvyFgsVAs', {
        json: {
            content: `${emoji} **💲${price}** **(💲${netChange.toFixed(2)})** ${emoji}`
        }
    }, (err, res, body) => {
        if (err) {
            console.log(err);
            return
        }
        console.log(res.statusCode)
    })
}