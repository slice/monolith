const Discord = require('discord.js');
const { Client, Collection } = Discord;

const Scanner = require('./scanner');

module.exports = class Monolith extends Client {
  constructor(options, clientOptions) {
    super(clientOptions);

    if (typeof options === 'string')
      this.prefix = options;
    else
      this.prefix = options.prefix;

    this.commands = new Collection();

    this.on('message', this._handleMessage.bind(this));
  }

  command(name, handler) {
    this.commands.set(name, {
      handler,
    });
  }

  _satisfiesPrefix(message, prefix = this.prefix) {
    const { content } = message;

    if (typeof prefix === 'string')
      return content.startsWith(prefix) ? prefix : false;
    else if (prefix instanceof RegExp)
      return content.match(prefix)[0];
    else if (typeof prefix === 'function')
      return this._satisfiesPrefix(message, prefix(message));

    return false;
  }

  async _handleMessage(message) {
    let prefix = this._satisfiesPrefix(message);
    if (!prefix) return;

    let rest = message.content.substr(prefix.length);
    let scanner = new Scanner(rest);
    let command = scanner.word();

    let args = [];
    while (!scanner.atEnd)
      args.push(scanner.arg());

    if (!this.commands.has(command)) return;
    let info = this.commands.get(command);

    let returnValue = info.handler(message);
    if (returnValue instanceof Promise)
      returnValue = await returnValue;

    if (typeof returnValue === 'string')
      await message.channel.send(returnValue);
    else if (Array.isArray(returnValue))
      await message.channel.send(returnValue.join('\n'));
    else if (returnValue instanceof Discord.RichEmbed)
      await message.channel.send({ embed: returnValue });
  }
};
