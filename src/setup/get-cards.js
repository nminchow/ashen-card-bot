const got = require('got');

const types = ['ceremonial', 'charm', 'divine', 'illusion', 'natural', 'sympathy', 'time'];

const referenceCards = types.map((dice) => ({
  dice,
  stub: `https://cdn.ashes.live/images/cards/${dice}-magic.jpg`,
  type: 'reference',
  name: `${dice} magic`,
}));

module.exports = async () => {
  const cards = referenceCards;
  let url = 'https://api.ashes.live/v2/cards?limit=100';
  while (url) {
    // eslint-disable-next-line no-await-in-loop
    const { next, results } = await got(url).json();
    cards.push(...results);
    url = next;
  }
  return cards;
};
