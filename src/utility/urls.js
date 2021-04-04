const buildDiceUrl = (dice) => (dice ? `https://nminchow.github.io/ashen-card-bot/dice-2/${dice}.png` : null);
const buildCardUrl = (stub) => `https://ashes.live/cards/${stub}/`;
const buildImgUrl = (stub) => `https://cdn.ashes.live/images/cards/${stub}.jpg`;

module.exports = {
  buildDiceUrl,
  buildCardUrl,
  buildImgUrl,
};
