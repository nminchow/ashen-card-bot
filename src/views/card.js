const Discord = require('discord.js');
const parseText = require('../utility/parse-text');
const colorForDice = require('../utility/color-for-dice');


module.exports = ({
  name,
  stub,
  dice,
  text,
  release: { name: releaseName },
  cost,
  type,
  placement,
  battlefield,
  life,
  spellboard,
  attack,
  recover,
  copies,
}, client, fullArt) => {
  const url = `https://ashes.live/cards/${stub}/`;
  const imgUrl = `https://cdn.ashes.live/images/cards/${stub}.jpg`;
  const diceUrl = dice ? `https://nminchow.github.io/ashen-card-bot/dice-2/${dice}.png`: null;
  const embed = new Discord.MessageEmbed();
  embed.setFooter(releaseName);
  embed.setAuthor(name, diceUrl, url);
  embed.setColor(colorForDice(dice));

  const addField = (index, item, inline = false, or = false) => {
    const text = or ? `${item} OR` : item;
    const subbedText = parseText(text, client);
    if (index === 0 ) {
      return embed.addField('Cost', subbedText, inline);
    }
    embed.addField('\u200B', subbedText, inline);
  };

  if (fullArt) {
    embed.setImage(imgUrl);
  } else {
    const title = placement ? `${type} ⬦ ${placement}` : type;
    embed.setTitle(title);
    embed.setDescription(parseText(text, client));
    embed.setThumbnail(imgUrl);
    Object.entries({ battlefield, attack, life, spellboard, recover }).map(([key, value]) => {
      if (value === undefined) return;
      embed.addField(key, value, true);
    });
    if (cost) {
      cost.map((costItem, index) => {
        if (Array.isArray(costItem)) {
          costItem.map((orCost, innerIndex) => {
            last = innerIndex == costItem.length - 1;
            addField(index + innerIndex, orCost, true, !last);
          });
        } else {
          addField(index, costItem);
        }
      });
    }
    if (copies) {
      embed.addField("Copies", copies);
    }
  }
  return embed;
};
