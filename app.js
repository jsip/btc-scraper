const request = require('request');

let prices = [];
let emoji;
let netChange = 0;
let color;

const FOREX = 1.25;
const PRICE_INT = 10000;

setInterval(() => {
    getPrice();
}, PRICE_INT)

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
                    let _netChange = price - lastPrice
                    netChange = (_netChange / lastPrice).toFixed(4);
                    emoji = '🚀🟢🚀';
                    color = '65280';
                } else {
                    let _netChange = price - lastPrice;
                    netChange = ((_netChange / lastPrice) * -1).toFixed(4);
                    emoji = '🏴‍☠️🔴🏴‍☠️';
                    color = '16711680';
                }
                await postPriceToDisc(price);
            }
        })
}

const postPriceToDisc = async (price) => {
    let _priceCAD = price * FOREX;
    let _price = _priceCAD.toFixed(2);
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    priceCAD = _price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // let content = `${emoji} **💲${price}** / **💲${priceCAD}** ${netChange}% ${emoji}`;
    request.post('https://discordapp.com/api/webhooks/821211543593156638/B58FaDO9eS5AgKG5dEPSN5CVMEXFvy1dd9P0nfpVi39qtK3IuCJo7IKFR8Sc-Vcf1OEv', {
        json: {
            "embeds": [{
            "title": "Bitcoin",
            "color": color,
            "fields": [
            {
                "name": "USD",
                "value": `**💲${price}**`,
                "inline": true
            },
            {
                "name": "CAD",
                "value": `**💲${priceCAD}**`,
                "inline": true
            },
            {
                "name": "Percentage Change",
                "value": `**💲${netChange}%**`,
                "inline": false
            }
            ]
        }]
        },

    }, (err, res, body) => {
        if (err) {
            console.log(err);
            return
        }
        console.log(res.statusCode)
    })
}