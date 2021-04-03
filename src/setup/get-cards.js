const got = require('got');

module.exports = async () => {
  const cards = [];
  let url = 'https://api.ashes.live/v2/cards?limit=100';
  while (url) {
    // eslint-disable-next-line no-await-in-loop
    const { next, results } = await got(url).json();
    cards.push(...results);
    url = next;
  }
  return cards;
};
