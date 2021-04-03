const Discord = require('discord.js');

module.exports = ({ name, stub, dice }, fullArt) => {
  const url = `https://ashes.live/cards/${stub}/`;
  const imgUrl = `https://cdn.ashes.live/images/cards/${stub}.jpg`;
  const diceUrl = `https://cdn.ashes.live/images/cards/${dice}-magic.jpg`;
  const embed = new Discord.MessageEmbed();
  embed.setAuthor(name, diceUrl, url);
  if (fullArt) {
    embed.setImage(imgUrl);
  } else {
    embed.setThumbnail(imgUrl);
  }
  return embed;
};
