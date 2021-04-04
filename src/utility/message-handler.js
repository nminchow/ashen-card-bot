const bestMatch = require('../controllers/cards/best-match');
const removeDelineators = require('./remove-delineators');

module.exports = (message, client) => {
  const callMatch = (art) => (result) => bestMatch(message, result, client, art);

  const hits = message.content.match(/\[\[.*?\]\]/gi) || [];
  hits.map(removeDelineators).forEach(callMatch(false));

  const artHits = message.content.match(/\{\{.*?\}\}/gi) || [];
  artHits.map(removeDelineators).forEach(callMatch(true));
};
