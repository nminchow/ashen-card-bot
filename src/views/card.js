const Discord = require('discord.js');

module.exports = ({ name, stub, dice }, fullArt) => {
  const url = `https://ashes.live/cards/${stub}/`;
  const imgUrl = `https://cdn.ashes.live/images/cards/${stub}.jpg`;
  const diceUrl = `https://nminchow.github.io/ashen-card-bot/dice/${dice}.png`;
  const embed = new Discord.MessageEmbed();
  embed.setFooter(null, diceUrl);
  embed.setAuthor(name, null, url);
  if (fullArt) {
    embed.setImage(imgUrl);
  } else {
    embed.setThumbnail(imgUrl);
  }
  return embed;
};
