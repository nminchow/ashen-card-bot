const rule = require('../../views/rule');
const searchFuse = require('../shared/search-fuse');

module.exports = (message, text, client) => {
  // const result = bestMatch(text, client, [{ type: '^rule' }]);
  const result = searchFuse(text, client).find(({ item: { type } }) => type === 'rule');
  if (!result) {
    return message.channel.send('rule not found');
  }
  return message.channel.send({ embed: rule(result.item) });
};
