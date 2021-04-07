const got = require('got');
const rawRules = require('../../docs/rules.json');

const types = ['ceremonial', 'charm', 'divine', 'illusion', 'natural', 'sympathy', 'time'];

const referenceCards = types.map((dice) => ({
  dice,
  stub: `https://cdn.ashes.live/images/cards/${dice}-magic.jpg`,
  type: 'reference',
  name: `${dice} magic`,
}));

const rules = Object.entries(rawRules).map(([name, text]) => ({
  name,
  stub: name,
  type: 'rule',
  text,
}));

module.exports = async () => {
  const cards = [...referenceCards, ...rules];
  let url = 'https://api.ashes.live/v2/cards?limit=100';
  while (url) {
    // eslint-disable-next-line no-await-in-loop
    const { next, results } = await got(url).json();
    cards.push(...results);
    url = next;
  }
  return cards;
};
