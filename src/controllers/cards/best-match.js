const card = require('../../views/card');

module.exports = (message, text, { cardFuse }, fullArt = false) => {
  console.log(text);
  const result = cardFuse.search(text)[0];
  console.log(result);
  if (result) {
    return message.embed(card(result.item, fullArt));
  }
  return message.say('card not found');
};
