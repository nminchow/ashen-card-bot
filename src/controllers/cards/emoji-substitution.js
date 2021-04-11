const { orderBy } = require('lodash');
const { buildCardLink } = require('../../utility/urls');

const emoji = [
  '🔸',
  '🔹',
  '🔺',
  '▪️',
];

module.exports = ({ text, conjurations = [] }) => {
  const conjurationsInText = orderBy(conjurations.map(({ name, ...att }) => ({
    index: text.indexOf(`[[${name}]]`),
    name,
    ...att,
  })).filter(({ index }) => index >= 0), 'index');

  const emojiMapping = conjurationsInText.reduce(
    (acc, conj, i) => ({ ...acc, [emoji[i]]: conj }),
    {},
  );

  const subbedText = Object.entries(emojiMapping).reduce(
    (subbedText, [key, { name, stub }]) => subbedText.replace(
      `[[${name}]]`,
      `${buildCardLink({ name, stub })}${key}`,
    ),
    text,
  );

  return {
    subbedText,
    emojiMapping,
  };
};
