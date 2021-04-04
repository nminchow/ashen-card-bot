const removeDelineators = require('./remove-delineators');
const emojiMapping = require('./emoji-mapping');

const regex = new RegExp(
  Object.keys(emojiMapping).map((id) => `\\[\\[${id}\\]\\]`).join('|'),
  'gi',
);

module.exports = (cardText, { emojis }) => cardText.replace(regex, (match) => {
  const key = removeDelineators(match);
  return emojis.resolve(emojiMapping[key]);
});
