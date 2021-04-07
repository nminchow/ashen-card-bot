const Discord = require('discord.js');
const { buildCardLink } = require('../utility/urls');

module.exports = (hits, misses) => {
  const embed = new Discord.MessageEmbed();

  embed.setAuthor('Ashes.live Card Links', 'https://ashes.live/favicon-32x32.png');

  const description = hits.map(buildCardLink);
  const notFound = misses.map(({ miss }) => `${miss} not found`);

  embed.setDescription([...description, ...notFound].join('\n'));

  return embed;
};
