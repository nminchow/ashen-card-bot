const { MessageEmbed } = require('discord.js');
const { warning } = require('../../constants/colors');

module.exports = (id, { name, pools: { stage } = {} }) => {
  const embed = new MessageEmbed();
  embed.setTitle(name);
  embed.setFooter(`Draft:User:${id}`);
  if (!stage) {
    embed.setColor(warning);
    embed.setDescription('Initializing...');
    return embed;
  }
};
