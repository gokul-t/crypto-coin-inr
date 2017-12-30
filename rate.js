(() => {
    "use strict";
    const axios = require("axios");

    module.exports = () => {
        return allCoins().then(printResult).catch(console.error);
    }

    const usdInrRate = 63.80;

    function printResult(res) {
        res.forEach(function (c) {
            let p = calc(c.price_inr, c.price_koinex);
            console.log(`${c.symbol} \n usd ${c.price_usd}, inr ${c.price_inr}, koinex ${c.price_koinex},  % is ${p}`);
            if (p <= 1.25) {
                console.log(` buy this now, and sell at ${(c.price_inr * 1.3)}`);
            } else if (p >= 1.33) {
                console.log(` sell now at, ${(c.price_inr * 1.33)}`);
            } else {
                console.log(` wait till ${(c.price_inr * 1.25)} and check again`);
            }
        });
    }

    function getInrRate(usd) {
        return (usd * usdInrRate);
    }

    function calc(inr, koinex) {
        return koinex / inr;
    }

    function allCoins() {
        return Promise.all([getCoinInrRates(), getCoinUsdRates()])
            .then(result => {
                // console.log(result);
                let x = [];
                result[1].forEach(element => {
                    if (result[0][element.symbol]) {
                        let e = element;
                        e.price_koinex = result[0][element.symbol];
                        x.push(e);
                    }
                });
                return x;
            })
    }

    function getCoinInrRates() {
        return axios.get("https://koinex.in/api/ticker").then(r => r.data).then(res => res.prices);
    }

    function getCoinUsdRates() {
        return axios.get("https://api.coinmarketcap.com/v1/ticker/?convert=INR&limit=10").then(r => r.data);
    }

})();