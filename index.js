const { request } = require('undici');
const express = require('express');
const bodyParser = require("body-parser");
const { clientId, clientSecret, port } = require('./config.json');
const Caver = require("caver-js");

const { add_nft_role } = require('./bot.js');

const rpcURL = "https://public-node-api.klaytnapi.com/v1/cypress";
const networkID = "8217";
const caver = new Caver(rpcURL);

const MTDZ_CONTRACT_ADDR = "0x46dbdc7965cf3cd2257c054feab941a05ff46488";
let mtdzContract = null;

async function initContract() {
	mtdzContract = await caver.kct.kip17.create(MTDZ_CONTRACT_ADDR);
	console.log("initContract ok");
}
initContract();

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

const app = express();

app.use(bodyParser.json());

app.get('/', async ({ query }, response) => {
	const { code } = query;
	let access_token = "";
	let token_type = "";

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					//redirect_uri: `http://localhost:${port}`,
					redirect_uri: `http://59.26.189.126:${port}`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await getJSONResponse(tokenResponseData.body);
			console.log(oauthData);

			access_token = oauthData.access_token;
			token_type = oauthData.token_type;

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}
	}

	response.redirect(`/LimeLight#access_token=${access_token}&token_type=${token_type}`)
});
app.get('/LimeLight', async ({ query }, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.post("/api_discord_connect", async (request, response) => {
	console.log("api_discord_connect", request.body);

	// 디스코드 봇이 유저에게 권한을 준다.
	const { wallet_addr, discord_user_id } = request.body;

	ret = await mtdzContract.balanceOf(wallet_addr);
	const count = Number(ret);
	if(count < 1){
		return response.json({
			code: -1,
			message: `count fail, ${count}`,
		});
	}

	console.log("count", count);
	add_nft_role(discord_user_id);

	return response.json({
		code: 200,
		message: "ok",
	});
});

app.post("/api_wallet", async (request, response) => {
	console.log("api_wallet", request.body);

	const addr = request.body.addr;
	let ret;
	ret = await mtdzContract.balanceOf(addr);
	const count = Number(ret);
	console.log("count", count);

	return response.json({
		code: 200,
		message: "ok",
		count,
	});
});


app.listen(port, () => console.log(`App listening at http://59.26.189.126:${port}`));