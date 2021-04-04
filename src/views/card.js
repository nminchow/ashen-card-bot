const Discord = require('discord.js');
const parseText = require('../utility/parse-text');
const colorForDice = require('../utility/color-for-dice');

module.exports = ({ name, stub, dice, text, release: { name: releaseName } }, client, fullArt) => {
  const url = `https://ashes.live/cards/${stub}/`;
  const imgUrl = `https://cdn.ashes.live/images/cards/${stub}.jpg`;
  const diceUrl = dice ? `https://nminchow.github.io/ashen-card-bot/dice-2/${dice}.png`: null;
  const embed = new Discord.MessageEmbed();
  embed.setFooter(releaseName);
  embed.setAuthor(name, diceUrl, url);
  embed.setColor(colorForDice(dice));
  if (fullArt) {
    embed.setImage(imgUrl);
  } else {
    embed.setDescription(parseText(text, client));
    embed.setThumbnail(imgUrl);
  }
  return embed;
};
