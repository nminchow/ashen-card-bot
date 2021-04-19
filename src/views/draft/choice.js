const { MessageEmbed } = require('discord.js');
const { warning, ready } = require('../../constants/colors');

module.exports = (id, playerId, { name, pools: { stage } = {} }) => {
  const embed = new MessageEmbed();
  embed.setTitle(name);
  embed.setFooter(`Draft:User:${id}`);
  if (!stage) {
    embed.setColor(warning);
    embed.setDescription('Initializing...');
    return embed;
  }

  embed.setAuthor(`${stage} selection`);
  embed.setColor(ready);
  return embed;
};
