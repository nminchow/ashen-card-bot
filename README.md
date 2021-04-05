# Ashes Lexicon

This is a companion bot for the [Ashes Reborn](https://www.plaidhatgames.com/news/2020/08/06/ashes-reborn/) card game by Plaid Hat games.

The bot's documentation can be accessed by adding it to a server and issuing the `!!help`
 command.

[invite link](https://discordapp.com/oauth2/authorize?client_id=828440100110073876&permissions=2147833920&scope=bot%20applications.commands)

## Contributing

Requirments:

* node 14.16 (or nvm)
* yarn

### Running Locally

First, create a `.env` file in the root of the directory with your dev bot's id and token, ex:

```
owner=867530942435225631
token=your_bot_token
```

Then, to start the bot...

```bash
nvm use # (if using nvm)
yarn start
```