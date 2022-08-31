const { request } = require('undici');
const express = require('express');
const { clientId, clientSecret, port } = require('./config.json');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

const app = express();

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
					redirect_uri: `http://localhost:${port}`,
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
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));