const rule = require('../../views/rule');
const bestMatch = require('../shared/best-match');

module.exports = (message, text, client) => {
  const result = bestMatch(text, client, [{ type: "'rule" }]);
  if (!result) {
    return message.channel.send('rule not found');
  }
  return message.channel.send({ embed: rule(result.item) });
};
