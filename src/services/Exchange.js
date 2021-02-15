"use strict";

// Requiere package:
const path = require("path");
const got = require("got");
const moment = require("moment");
const crypto = require("crypto");
const env = require(path.join(__dirname, "../../config/env"));
const Console_Messages = require(path.join(__dirname, "./Console_Messages"));
const consoleMessages = new Console_Messages();
const nonce = moment().unix();

class Exchange {
	constructor() {
		this.url = "https://bittrex.com/api/v1.1/";
		this.urlBalance = `${this.url}account/getbalance?apikey=${env.bittrexKey}`;
		this.urlSell = `${this.url}market/selllimit?apikey=${env.bittrexKey}`;
		this.urlTiker = `${this.url}public/getticker`;
	}

	// Crypto url with token secret
	hash(url) {
		const hash = crypto
			.createHmac("sha512", env.bittrexSecret)
			.update(url)
			.digest("hex");
		return hash;
	}

	// Get balance of Bittrex:
	async balance(currency) {
		try {
			const url = `${this.urlBalance}&currency=${currency}&nonce=${nonce}`;
			const hash = this.hash(url);
			const options = {
				headers: {
					apisign: hash,
				},
			};
			const client = await got(url, options);
			const balanceBittrex = JSON.parse(client.body);
			return balanceBittrex;
		} catch (err) {
			const payloadLog = {
				message: err,
				module: __filename,
				line: "29:31",
				type: "error",
			};
			consoleMessages.create(payloadLog);
			return 500;
		}
	}

	// Selling Criptocoin to USD:
	async sell(currency, value) {
		try {
			const rate = await this.tiker(currency);

			if (rate != 500) {
				const url = `${this.urlSell}&market=USD-${currency}&quantity=${value}&rate=${rate.Bid}&nonce=${nonce}`;
				const hash = await this.hash(url);
				const options = {
					headers: {
						apisign: hash,
					},
				};
				await got(url, options);
				return 200;
			} else {
				return 500;
			}
		} catch (err) {
			// Error handler;
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: "29:31",
				type: "error",
			};
			consoleMessages.create(payloadLog);
			return 500;
		}
	}

	// Get query to market of BITTREX:
	async tiker(currency) {
		try {
			const url = `${this.urlTiker}?market=usd-${currency}`;
			const hash = await this.hash(url);
			const options = {
				headers: {
					apisign: hash,
				},
			};

			const client = await got(url, options);
			const tikerBittrex = JSON.parse(client.body);
			return tikerBittrex;
		} catch (err) {
			const payloadLog = {
				message: err.message,
				module: __filename,
				line: "55:57",
				type: "error",
			};
			consoleMessages.create(payloadLog);
			return 500;
		}
	}
}

module.exports = Exchange;
