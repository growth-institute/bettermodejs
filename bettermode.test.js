import {BetterMode} from './index.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

/**
 * Retrieves the BetterMode access token from the .env file.
 *
 * @returns {Promise<string|null>} - The access token or null if not found.
 */
async function checkAccessToken() {
	const envPath = path.resolve(process.cwd(), '.env');
	const envContent = await fs.readFile(envPath, 'utf8');
	const envLines = envContent.split('\n');
	const accessTokenLine = envLines.find(line => line.startsWith('BETTERMODE_ACCESS_TOKEN='));
	return accessTokenLine ? accessTokenLine.split('=')[1] : null;
}

/**
 * Saves the BetterMode access token to the .env file.
 *
 * @param {string} accessToken - The access token to save.
 * @returns {Promise<void>}
 */
async function saveAccessToken(accessToken) {
	const envPath = path.resolve(process.cwd(), '.env');
	let envContent = await fs.readFile(envPath, 'utf8');

	const regex = /^BETTERMODE_ACCESS_TOKEN=.*/m;
	if (regex.test(envContent)) {
		envContent = envContent.replace(regex, `BETTERMODE_ACCESS_TOKEN=${accessToken}`);
	} else {
		envContent += `\nBETTERMODE_ACCESS_TOKEN=${accessToken}`;
	}

	await fs.writeFile(envPath, envContent);
	console.log('Access token saved to .env file');
}

/**
 * Sets the access token by either using an existing one or fetching a new one.
 *
 * @param {BetterMode} betterMode - The BetterMode instance.
 * @param {string|null} memberId - The member ID to impersonate (optional).
 * @returns {Promise<string>} - The status message.
 */
async function setAccessToken(betterMode, memberId = null) {
	const existingToken = await checkAccessToken();

	if (existingToken) {
		console.log('Existing ACCESS_TOKEN found in .env file');
		return 'Existing ACCESS_TOKEN found';
	}

	const clientId = process.env.BETTERMODE_CLIENT_ID;
	const clientSecret = process.env.BETTERMODE_CLIENT_SECRET;
	const networkId = process.env.BETTERMODE_NETWORK_ID;
	const url = `https://${clientId}:${clientSecret}@app.tribe.so/graphql`;

	const accessToken = await betterMode.getAppToken(networkId, url, memberId);

	let response = '';

	if (accessToken) {
		await saveAccessToken(accessToken);
		response = memberId ? 'Member access token set successfully' : 'Tribe Access Token was renewed, try again';
	} else {
		response = memberId ? 'Error: Member Access Token not saved' : 'Tribe Access Token was not regenerated';
	}

	return response;
}

/**
 * Retrieves a new access token for a specific member.
 *
 * @param {BetterMode} betterMode - The BetterMode instance.
 * @param {string} memberId - The member ID to impersonate.
 * @returns {Promise<string|null>} - The new access token or null if an error occurred.
 */
async function getAccessToken(betterMode, memberId) {
	const clientId = process.env.BETTERMODE_CLIENT_ID;
	const clientSecret = process.env.BETTERMODE_CLIENT_SECRET;
	const networkId = process.env.BETTERMODE_NETWORK_ID;
	const url = `https://${clientId}:${clientSecret}@app.tribe.so/graphql`;
	const accessToken = await betterMode.getAppToken(networkId, url, memberId);
	return accessToken || null;
}

describe('BetterMode API Client Tests', () => {
	let betterMode;
	let accessToken;
	// after each test wait one second
	afterEach(async () => {
		console.info('Waiting 1 second before next test...');
		await new Promise(resolve => setTimeout(resolve, 1000));
	});
	beforeAll(async () => {
		accessToken = await checkAccessToken();
		expect(accessToken).toBeDefined();
		betterMode = new BetterMode(accessToken);
		const emailToSearch = 'jesus@growthinstitute.com'
		const members = await betterMode.getMembers({
			limit: 15,
			query: emailToSearch,
			orderBy: 'createdAt',
			reverse: true,
			status: ['Suspended', 'VERIFIED', 'UNVERIFIED'],
			filterBy: [],
		});
		const member = members.edges.find(member => member.node.email === emailToSearch)?.node;
		expect(member).toBeDefined();
		const memberAccessToken = await getAccessToken(betterMode, member.id);
		expect(memberAccessToken).toBeDefined();
		betterMode = new BetterMode(memberAccessToken);
	});

	describe('Get Spaces', () => {
		it('should retrieve a list of spaces', async () => {
			const spaces = await betterMode.getSpaces();
			console.info('Spaces:', spaces);
			expect(spaces).toBeDefined();
			expect(spaces.totalCount).toBeGreaterThan(0);
			expect(spaces.nodes).toBeInstanceOf(Array);
			expect(spaces.nodes.length).toBeGreaterThan(0);
		});
	});

	describe('Get Specific Space', () => {
		it('should retrieve a specific space by ID', async () => {
			// Replace 'SPACE_ID' with a valid space ID for testing
			const spaceId = 'XMDZy7lIpm2u';
			const space = await betterMode.getSpace(spaceId);
			expect(space).toBeDefined();
			expect(space.id).toBe(spaceId);
			expect(space.name).toBeDefined();
		});
	});

	describe('Create Reply', () => {
		it('should create a reply to a post', async () => {
			// Replace 'POST_ID' with a valid post ID for testing
			const postId = '5uIidAvNAZuvhFw';
			const replyContent = 'Hi!';
			const betterModeAdmin = new BetterMode(accessToken);
			const status = await betterModeAdmin.createReply(postId, replyContent);
			console.info('Reply status:', status);
			expect(status).toBeDefined();
			expect(typeof status).toBe('string');
			// You might want to check for specific status values based on API response
		});
	});

	describe('Get Members', () => {
		it('should retrieve a list of members', async () => {
			betterMode = new BetterMode(accessToken);
			const members = await betterMode.getMembers();
			expect(members).toBeDefined();
			expect(members.totalCount).toBeGreaterThan(0);
			expect(members.edges).toBeInstanceOf(Array);
			expect(members.edges.length).toBeGreaterThan(0);
		});
	});

	describe('Search Member by Email', () => {
		it('should find a specific member by email', async () => {
			const emailToSearch = 'jesus@growthinstitute.com';
			const searchOptions = {
				"limit": 15,
				"query": emailToSearch,
				"orderBy": "createdAt",
				"reverse": true,
				"status": [
					"Suspended",
					"VERIFIED",
					"UNVERIFIED"
				],
				"filterBy": []
			}
			console.info('Searching for member with email:', emailToSearch);
			console.info("Access  Token", accessToken)
			betterMode = new BetterMode(accessToken);
			const members = await betterMode.getMembers(searchOptions);
			console.info('Members:', members);
			expect(members).toBeDefined();
			expect(members.totalCount).toBeGreaterThan(0);
			// Verify that at least one member was found
			expect(members.edges.length).toBeGreaterThan(0);
			const firstMember = members.edges.find(member => member.node.email === emailToSearch)?.node;
			expect(firstMember).toBeDefined();
			expect(firstMember.email).toBe(emailToSearch);
			expect(firstMember.name).toBeDefined();
			expect(firstMember.id).toBeDefined();
			expect(firstMember.status).toBeDefined();
		});
	});

	describe('Add and Remove Reaction', () => {
		let postId;

		beforeAll(async () => {
			// Replace with a valid post ID or fetch one dynamically
			postId = 'NiGOnKJIrypmvRo';
			expect(postId).toBeDefined();
		});

		it('should add a reaction to a post', async () => {
			const reactionType = '+1';
			const status = await betterMode.addReaction(postId, reactionType);
			expect(status).toBeDefined();
			expect(typeof status).toBe('string');
			// Optionally, verify specific status values
		});

		it('should remove a reaction from a post', async () => {
			const reactionType = '+1';
			const status = await betterMode.removeReaction(postId, reactionType);
			expect(status).toBeDefined();
			expect(typeof status).toBe('string');
			// Optionally, verify specific status values
		});
	});

	describe('Subscribe and Unsubscribe', () => {
		let publisherId;

		beforeAll(async () => {
			// Replace with a valid publisher ID or fetch one dynamically
			publisherId = 'NiGOnKJIrypmvRo';
			expect(publisherId).toBeDefined();
		});

		it('should subscribe to a publisher', async () => {
			const status = await betterMode.subscribe(publisherId);
			expect(status).toBeDefined();
			expect(typeof status).toBe('string');
			// Optionally, verify specific status values
		});

		it('should unsubscribe from a publisher', async () => {
			const status = await betterMode.unsubscribe(publisherId);
			expect(status).toBeDefined();
			expect(typeof status).toBe('string');
			// Optionally, verify specific status values
		});
	});

	describe('Get Feed', () => {
		it('should fetch feed data with detailed information', async () => {
			// Replace 'jesus@growthinstitute.com' with a valid member email if necessary
			const emailToSearch = 'jesus@growthinstitute.com';
			const betterModeAdmin = new BetterMode(accessToken);
			const members = await betterModeAdmin.getMembers({
				limit: 15,
				query: emailToSearch,
				orderBy: 'createdAt',
				reverse: true,
				status: ['Suspended', 'VERIFIED', 'UNVERIFIED'],
				filterBy: [],
			});
			const member = members.edges.find(member => member.node.email === emailToSearch)?.node;
			expect(member).toBeDefined();

			const memberAccessToken = await getAccessToken(betterMode, member.id);
			expect(memberAccessToken).toBeDefined();

			const feedData = await betterMode.getFeed({
				limit: 5,
				onlyMemberSpaces: true,
				orderBy: 'publishedAt',
				filterBy: [],
			});
			console.info('Feed data:', feedData);
			expect(feedData).toBeDefined();
			expect(feedData.totalCount).toBeGreaterThan(0);
			expect(feedData.nodes.length).toBeGreaterThan(0);

			const firstNode = feedData.nodes[0];
			expect(firstNode.id).toBeDefined();
			/*expect(firstNode.title).toBeDefined();
			expect(firstNode.createdAt).toBeDefined();
			expect(firstNode.space).toBeDefined();
			expect(firstNode.owner).toBeDefined();
			expect(firstNode.reactions).toBeDefined();
			expect(firstNode.replies).toBeDefined();*/

		});
	});
});
