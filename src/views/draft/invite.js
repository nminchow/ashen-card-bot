const Discord = require('discord.js');
const { orderBy } = require('lodash');

module.exports = (id, {
  author: { username, avatar },
  releases,
  name,
  open,
  users,
}) => {
  const embed = new Discord.MessageEmbed();

  embed.setAuthor(username, avatar);
  embed.setTitle(name);

  const orderedReleases = orderBy(
    Object.values(releases),
    ['size', 'stub'], ['desc', 'asc'],
  );

  const endingText = open ? 'accepting players. React with ✅ below to join!' : 'started! If participating, you should have received your first hand.';

  const description = `${name} is currently ${endingText}`;

  // TODO: It'd be nice to have deck links here, but we don't have the precon ids on the cards list
  const releaseNames = orderedReleases.map(({ name }) => `**${name}**`).join(', ');

  embed.addField('Releases in use:', `**Master Set**, ${releaseNames}`);

  embed.addField('Participants:', users.map((user) => `<@${user}>`).join('\n') || 'No current participants');

  embed.setDescription(description);
  embed.setFooter(`Draft:Join:${id}`);
  embed.setTimestamp();

  return { embed, icons: ['✅'] };
};
