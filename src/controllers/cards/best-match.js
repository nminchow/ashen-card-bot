const card = require('../../views/card');
const bestMatch = require('../shared/best-match');

module.exports = (message, text, client, fullArt = false) => {
  const result = bestMatch(text, client, [{ type: '!^rule' }]);
  if (!result) {
    return message.channel.send('card not found');
  }
  return message.channel.send({ embed: card(result.item, client, fullArt) });
};
