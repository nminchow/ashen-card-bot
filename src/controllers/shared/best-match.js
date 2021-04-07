const card = require('../../views/card');
const rule = require('../../views/rule');
const searchFuse = require('./search-fuse');

module.exports = (message, text, client, fullArt = false) => {
  const result = searchFuse(text, client)[0];
  if (!result) {
    return message.channel.send('card not found');
  }
  if (result.item.type === 'rule') {
    return message.channel.send({ embed: rule(result.item) });
  }
  return message.channel.send({ embed: card(result.item, client, fullArt) });
};
