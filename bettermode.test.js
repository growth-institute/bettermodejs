import { BetterMode } from './index.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function checkAccessToken() {
	const envPath = path.resolve(process.cwd(), '.env');
	const envContent = await fs.readFile(envPath, 'utf8');
	const envLines = envContent.split('\n');
	const accessTokenLine = envLines.find(line => line.startsWith('ACCESS_TOKEN='));
	return accessTokenLine ? accessTokenLine.split('=')[1] : null;
}

async function saveAccessToken(accessToken) {
	const envPath = path.resolve(process.cwd(), '.env');
	let envContent = await fs.readFile(envPath, 'utf8');

	const regex = /^ACCESS_TOKEN=.*/m;
	if(regex.test(envContent)) {
		envContent = envContent.replace(regex, `ACCESS_TOKEN=${ accessToken }`);
	} else {
		envContent += `\nACCESS_TOKEN=${ accessToken }`;
	}

	await fs.writeFile(envPath, envContent);
	console.log('Access token saved to .env file');
}

async function setAccessToken(betterMode, member = null) {
	const existingToken = await checkAccessToken();

	if(existingToken) {
		console.log('Existing ACCESS_TOKEN found in .env file');
		return 'Existing ACCESS_TOKEN found';
	}

	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const networkId = process.env.NETWORK_ID;
	const url = `https://${ clientId }:${ clientSecret }@app.tribe.so/graphql`;

	const accessToken = await betterMode.getAppToken(networkId, url, member);

	let response = '';

	if(accessToken) {
		await saveAccessToken(accessToken);
		response = member ? 'Member access token set successfully' : 'Unauthorized: Tribe Access Token was renewed, try again';
	} else {
		response = member ? 'Error: Member Access Token not saved' : 'Unauthorized: Tribe Access Token was not regenerated';
	}

	return response;
}

describe('Get Spaces and setAccessToken', () => {
	it('should set access token or use existing one', async () => {
		const betterMode = new BetterMode();
		const response = await setAccessToken(betterMode);
		expect([
			'Unauthorized: Tribe Access Token was renewed, try again',
			'Unauthorized: Tribe Access Token was not regenerated',
			'Existing ACCESS_TOKEN found',
		]).toContain(response);

		if(response !== 'Existing ACCESS_TOKEN found') {
			const envPath = path.resolve(process.cwd(), '.env');
			const envContent = await fs.readFile(envPath, 'utf8');
			const envLines = envContent.split('\n');
			const accessTokenLine = envLines.find(line => line.startsWith('ACCESS_TOKEN='));
			expect(accessTokenLine).toBeDefined();
			expect(accessTokenLine.split('=')[1].length).toBeGreaterThan(0);
		}
	});
});

// describe get access token from en and then call getMembers
describe('Get Members', () => {
	it('should get members', async () => {
		const betterMode = new BetterMode();
		const accessToken = await checkAccessToken();
		expect(accessToken).toBeDefined();
		const members = await betterMode.getMembers(accessToken);
		expect(members).toBeDefined();
		expect(members.totalCount).toBeGreaterThan(0);
	});
});

describe('Search Member by Email', () => {
	it('should find a specific member by email', async () => {
		const betterMode = new BetterMode();
		const accessToken = await checkAccessToken();
		expect(accessToken).toBeDefined();

		const searchOptions = {
			limit: 15,
			query: 'jesus@growthinstitute.com',
			orderBy: 'createdAt',
			reverse: true,
			status: [
				'Suspended',
				'VERIFIED',
				'UNVERIFIED',
			],
			filterBy: [],
		};

		const members = await betterMode.getMembers(accessToken, searchOptions);

		expect(members).toBeDefined();
		expect(members.totalCount).toBeGreaterThan(0);

		// Verificar que se encontró al menos un miembro
		expect(members.edges.length).toBeGreaterThan(0);

		// Verificar que el primer miembro encontrado tiene el correo electrónico buscado
		const firstMember = members.edges[0].node;
		expect(firstMember.email).toBe('jesus@growthinstitute.com');

		// Verificaciones adicionales sobre el miembro encontrado
		expect(firstMember.name).toBeDefined();
		expect(firstMember.id).toBeDefined();
		expect(firstMember.status).toBeDefined();

		// Imprimir información del miembro encontrado
		console.log('Member found:', {
			name: firstMember.name,
			email: firstMember.email,
			id: firstMember.id,
			status: firstMember.status,
		});
	});
});
