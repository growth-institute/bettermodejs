import 'dotenv/config';
import { BetterMode } from './index.js';

const betterMode = new BetterMode(process.env.ACCESS_TOKEN);

//const spaces = await betterMode.getSpaces();
//console.log(JSON.stringify(spaces, null, 2));

//const space = await betterMode.getSpace('4bPrYu24h5Rk');
//console.log(JSON.stringify(space, null, 2));

//await betterMode.subscribe('3VrSY19RbKKfUXW');
//await betterMode.unsubscribe('3VrSY19RbKKfUXW');

await betterMode.createReply('psTlBIbOcpQsfyk', '<p>Hello, World!</p>');