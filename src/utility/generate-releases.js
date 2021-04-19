const { groupBy, orderBy } = require('lodash');
const icons = require('../constants/universal-emoji-list');

module.exports = (cards) => {
  const cardsBySet = groupBy(
    cards.filter(({ type }) => type !== 'rule' && type !== 'reference'),
    'release.stub',
  );
  return orderBy(Object.entries(cardsBySet).map(
    ([stub, entries]) => {
      const [{ release: { name } }] = entries;
      const size = entries.length;
      return { stub, name, size };
    },
  ), ['size', 'stub'], ['desc', 'asc']).slice(1).map(
    (entry, index) => ({ ...entry, icon: icons[index] }),
  );
};
