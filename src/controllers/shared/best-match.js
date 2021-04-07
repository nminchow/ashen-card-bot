module.exports = (text, client, filters = []) => {
  const { data: { cardFuse } } = client;
  const query = {
    $and: [
      ...filters,
      {
        $or: [
          { name: text },
          { title: text },
        ],
      },
    ],
  };
  console.log(query);
  console.log(cardFuse.search(query)[0]);
  return cardFuse.search(query)[0];
};
