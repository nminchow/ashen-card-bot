const searchFuse = require('../shared/search-fuse');
const sendCard = require('./send-card');

module.exports = (message, text, client, fullArt = false) => {
  // todo: switch to this once https://github.com/krisk/Fuse/issues/548 is addressed
  // const result = bestMatch(text, client, [{ type: '!^rule' }]);
  const result = searchFuse(text, client).find(({ item: { type } }) => type !== 'rule');
  if (!result) {
    return message.channel.send('card not found');
  }
  return sendCard(message, result, client, fullArt);
};
