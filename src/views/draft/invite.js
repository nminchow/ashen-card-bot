const { MessageEmbed } = require('discord.js');
const { orderBy } = require('lodash');

module.exports = (id, {
  author: { username, avatar },
  releases,
  name,
  open,
  players,
  pools: { stage, round, current } = {},
}) => {
  const embed = new MessageEmbed();

  embed.setAuthor(username, avatar);
  embed.setTitle(name);

  const orderedReleases = orderBy(
    Object.values(releases),
    ['size', 'stub'], ['desc', 'asc'],
  );

  const endingText = open ? 'is currently accepting players. React with ✅ below to join!' : 'is currently in progress!\n\n';

  const description = `${name} ${endingText}`;

  // TODO: It'd be nice to have deck links here, but we don't have the precon ids on the cards list
  const releaseNames = orderedReleases.map(({ name }) => name).join(', ');

  embed.addField('Releases in use:', `Master Set, ${releaseNames}\n\n`);

  if (stage) {
    const roundText = ['card', 'dice'].includes(stage) ? ` round ${round + 1}` : '';
    const helpText = stage !== 'card' ? ' (current player indicated by 🔸)' : '';
    embed.addField('Draft Step:', `**${stage}** selection${roundText}${helpText}`);
  }

  const userText = (user) => {
    const defaultText = `<@${user}>`;
    if (!stage || stage === 'card' || user !== current) return defaultText;
    return `${defaultText} 🔸`;
  };

  embed.addField('Participants:', players.map(userText).join('\n') || 'No current participants');

  embed.setDescription(description);
  embed.setFooter(`Draft:Join:${id}`);
  embed.setTimestamp();

  return { embed, icons: ['✅'] };
};
