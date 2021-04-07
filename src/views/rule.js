const Discord = require('discord.js');
const { ruleImg } = require('../utility/urls');

module.exports = ({ name, text }) => {
  const embed = new Discord.MessageEmbed();

  embed.setThumbnail(ruleImg);
  embed.setColor('#faf1e1');
  embed.setTitle(name);
  embed.setDescription(text);

  return embed;
};
