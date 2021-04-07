const bestMatch = require('../controllers/cards/best-match');
const fetchDeck = require('../controllers/decks/fetch');
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

  // gotchya here - 'share' is processed as a deck id if not checked for first
  const [, uuidMatch] = message.content.match(/https:\/\/ashes\.live\/decks\/share\/(.+?)\//) || [];
  const [, idMatch] = message.content.match(/https:\/\/ashes\.live\/decks\/(.+?)\//) || [];
  const match = uuidMatch || idMatch;
  if (match) {
    fetchDeck(message, match, client);
  }
};
