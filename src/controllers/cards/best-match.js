const card = require('../../views/card');
const searchFuse = require('../shared/search-fuse');

module.exports = (message, text, client, fullArt = false) => {
  // todo: switch to this once https://github.com/krisk/Fuse/issues/548 is addressed
  // const result = bestMatch(text, client, [{ type: '!^rule' }]);
  const result = searchFuse(text, client).find(({ item: { type } }) => type !== 'rule');
  if (!result) {
    return message.channel.send('card not found');
  }
  return message.channel.send({ embed: card(result.item, client, fullArt) });
};
