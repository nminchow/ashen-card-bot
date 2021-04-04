const Discord = require('discord.js');
const parseText = require('../utility/parse-text');
const colorForDice = require('../utility/color-for-dice');
const { buildCardUrl, buildImgUrl, buildDiceUrl } = require('../utility/urls');

module.exports = ({
  name,
  stub,
  dice,
  text,
  release: { name: releaseName } = {},
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
  const embed = new Discord.MessageEmbed();
  const diceUrl = buildDiceUrl(dice);
  embed.setColor(colorForDice(dice));
  if (type === 'reference') {
    embed.setAuthor(name, diceUrl, stub);
    embed.setImage(stub);
    return embed;
  }

  const url = buildCardUrl(stub);
  const imgUrl = buildImgUrl(stub);
  embed.setFooter(releaseName);
  embed.setAuthor(name, diceUrl, url);

  const addField = (index, item, inline = false, or = false) => {
    const text = or ? `${item} OR` : item;
    const subbedText = parseText(text, client);
    if (index === 0) {
      return embed.addField('Cost', subbedText, inline);
    }
    return embed.addField('\u200B', subbedText, inline);
  };

  if (fullArt) {
    embed.setImage(imgUrl);
  } else {
    const title = placement ? `${type} ⬦ ${placement}` : type;
    embed.setTitle(title);
    embed.setDescription(parseText(text, client));
    embed.setThumbnail(imgUrl);
    Object.entries({
      battlefield, attack, life, spellboard, recover,
    }).forEach(([key, value]) => {
      if (value === undefined) return;
      embed.addField(key, value, true);
    });
    if (cost) {
      cost.forEach((costItem, index) => {
        if (Array.isArray(costItem)) {
          costItem.forEach((orCost, innerIndex) => {
            const last = innerIndex === costItem.length - 1;
            addField(index + innerIndex, orCost, true, !last);
          });
        } else {
          addField(index, costItem);
        }
      });
    }
    if (copies) {
      embed.addField('Copies', copies);
    }
  }
  return embed;
};
