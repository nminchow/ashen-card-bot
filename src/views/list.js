const Discord = require('discord.js');
const { buildCardLink } = require('../utility/urls');

module.exports = (hits, client) => {
  const { data: { cardFuse } } = client;
  const embed = new Discord.MessageEmbed();

  embed.setAuthor('Ashes.live Card Links', 'https://ashes.live/favicon-32x32.png');

  const description = hits.map((text) => {
    const result = cardFuse.search(text)[0];
    if (result) {
      return buildCardLink(result.item);
    }
    return `'${text}' not found`;
  }).join('\n');
  embed.setDescription(description);

  return embed;
};
