const card = require('../../views/card');

module.exports = (message, text, client, fullArt = false) => {
  const { data: { cardFuse } } = client;
  const result = cardFuse.search(text)[0];
  if (result) {
    return message.embed(card(result.item, client, fullArt));
  }
  return message.say('card not found');
};
