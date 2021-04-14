const sendCard = require('../controllers/cards/best-match');
const emojiSubstitution = require('../controllers/cards/emoji-substitution');
const searchFuse = require('../controllers/shared/search-fuse');
const draftHandler = require('../controllers/draft/reaction-handler');

module.exports = (remove = false) => async (messageReaction, user) => {
  if (!messageReaction.partial && messageReaction.me) return null;
  if (messageReaction.partial) {
    console.log('attempting partial');
    try {
      await messageReaction.fetch();
      await messageReaction.users.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching partial: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return null;
    }
  }
  const { count, emoji: { name }, message } = messageReaction;
  console.log(message.author.id);
  if (message.author.id !== process.env.owner) return null;
  const alsoHasOwn = await messageReaction.users.resolve(process.env.owner);
  console.log(alsoHasOwn);
  if (!alsoHasOwn) return null;

  if (message.embeds[0]?.footer.text.split(':')[0] === 'Draft') {
    return draftHandler(messageReaction, user, remove);
  }

  // card reaction

  // this check isn't technically necessary as alsoHasOwn should be null, but just in case:
  if (remove) return null;
  if (count !== 2) return null;
  // remove own reaction
  messageReaction.users.remove(process.env.owner);
  const [reactionOnStub] = message.embeds[0].author.url.split('/').slice(-2);
  // send card to which reaction refers
  // TODO: probably need some error handling here
  const reactionOnCard = searchFuse(reactionOnStub, messageReaction.client)[0].item;
  const { emojiMapping } = emojiSubstitution(reactionOnCard);
  const { stub } = emojiMapping[name];
  return sendCard(message, stub);
};
