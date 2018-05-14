# monolith

A sane library for command processing in Discord.js.

```js
const { Monolith } = require('monolith');

let client = new Monolith('!');

client.command('ping', () => 'Pong!');
client.command('user', ({ author: { id, tag } }) => `${id}: ${tag}`);

client.login('...');
```
