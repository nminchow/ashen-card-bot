const bestMatch = require('../controllers/cards/best-match');
const removeDelineators = require('./remove-delineators');
const cardList = require('../views/list');

module.exports = (message, client) => {
  const callMatch = (art) => (result) => bestMatch(message, result, client, art);

  const matches = message.content.match(/\[\[.*?\]\]/gi) || [];
  const artMatches = message.content.match(/\{\{.*?\}\}/gi) || [];

  const hits = matches.map(removeDelineators);
  const artHits = artMatches.map(removeDelineators);

  if (hits.length + artHits.length < 3) {
    hits.forEach(callMatch(false));
    artHits.forEach(callMatch(true));
  } else {
    message.channel.send({ embed: cardList([...hits, ...artHits], client) });
  }
};
