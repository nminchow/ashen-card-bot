module.exports = (text, client, filters = []) => {
  const { data: { cardFuse } } = client;
  const query = {
    $and: [
      ...filters,
      {
        $or: [
          { name: text },
          { stub: text },
        ],
      },
    ],
  };
  return cardFuse.search(query);
};
