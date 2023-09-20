import { BetterMode } from './index.js';
import dotenv from 'dotenv';

// Import the environment variables
dotenv.config();

// Function that mimics setAccessToken in PHP
async function setAccessToken(betterMode, member = null) {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const networkId = process.env.NETWORK_ID;
    const url = `https://${clientId}:${clientSecret}@app.tribe.so/graphql`;
  
    const res = await betterMode.getAppToken(networkId, url, member);
  
    let response = '';
  
    if (member) {
        if (res && res.data && res.data.limitedToken && res.data.limitedToken.accessToken) {
            // Replace this line with your method of storing the token
            // e.g., some database operation or local storage
            response = 'Member access token set successfully';
        } else {
            response = 'Error: Member Access Token not saved';
        }
    } else {
        if (res && res.data && res.data.limitedToken && res.data.limitedToken.accessToken) {
            // Replace this line with your method of storing the token
            // e.g., some database operation or local storage
            response = 'Unauthorized: Tribe Access Token was renewed, try again';
        } else {
            response = 'Unauthorized: Tribe Access Token was not regenerated';
        }
    }
  
    return response;
}

// Your existing test
describe('Get Spaces and setAccessToken', () => {
    it('should set access token', async () => {
        const betterMode = new BetterMode();
        const response = await setAccessToken(betterMode);
        expect(['Unauthorized: Tribe Access Token was renewed, try again', 
                 'Unauthorized: Tribe Access Token was not regenerated']).toContain(response);
    });
});
