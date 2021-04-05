const buildDiceUrl = (dice) => (dice ? `https://nminchow.github.io/ashes-lexicon/dice-2/${dice}.png` : null);
const buildCardUrl = (stub) => `https://ashes.live/cards/${stub}/`;
const buildImgUrl = (stub) => `https://cdn.ashes.live/images/cards/${stub}.jpg`;
const buildDeckUrl = (id) => `https://ashes.live/decks/${id}/`;
const buildCardLink = ({ name, stub }) => `[${name}](${buildCardUrl(stub)})`;

module.exports = {
  buildDiceUrl,
  buildCardUrl,
  buildImgUrl,
  buildDeckUrl,
  buildCardLink,
};
