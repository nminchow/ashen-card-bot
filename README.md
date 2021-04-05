# Ashes Lexicon

This is a companion bot for the [Ashes Reborn](https://www.plaidhatgames.com/news/2020/08/06/ashes-reborn/) card game by Plaid Hat games.

The bot's documentation can be accessed by adding it to a server and issuing the `!!help`
 command.

[invite link](https://discordapp.com/oauth2/authorize?client_id=828440100110073876&permissions=2147833920&scope=bot%20applications.commands)

## Contributing

The bot is built with [discord.js](https://discord.js.org/) and [commando](https://discordjs.guide/commando/).

The project follows the commando convention for folder structure, with command handlers in the `/controllers` folder, embed generators in the `/view` folder, and general utilities in the `/utility` folder.

### Running Locally

Requirments:

* node 14.16 (or nvm)
* yarn

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