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
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `ACCESS_TOKEN=${accessToken}`);
  } else {
    envContent += `\nACCESS_TOKEN=${accessToken}`;
  }

  await fs.writeFile(envPath, envContent);
  console.log('Access token saved to .env file');
}

async function setAccessToken(betterMode, member = null) {
  const existingToken = await checkAccessToken();

  if (existingToken) {
    console.log('Existing ACCESS_TOKEN found in .env file');
    return 'Existing ACCESS_TOKEN found';
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const networkId = process.env.NETWORK_ID;
  const url = `https://${clientId}:${clientSecret}@app.tribe.so/graphql`;

  const accessToken = await betterMode.getAppToken(networkId, url, member);

  let response = '';

  if (accessToken) {
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
      'Existing ACCESS_TOKEN found'
    ]).toContain(response);

    if (response !== 'Existing ACCESS_TOKEN found') {
      const envPath = path.resolve(process.cwd(), '.env');
      const envContent = await fs.readFile(envPath, 'utf8');
      const envLines = envContent.split('\n');
      const accessTokenLine = envLines.find(line => line.startsWith('ACCESS_TOKEN='));
      expect(accessTokenLine).toBeDefined();
      expect(accessTokenLine.split('=')[1].length).toBeGreaterThan(0);
    }
  });
});
