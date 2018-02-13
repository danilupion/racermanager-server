/* eslint-disable no-console */

const minimist = require('minimist');

const { User } = require('../models');
const connectMongoose = require('../helpers/mongoose');

const args = minimist(process.argv.slice(2));

const COMMANDS = {
  create: 'create',
  changePassword: 'change-password',
};

const command = args._.length && args._[0].toLowerCase();

/**
 * Exits the program
 */
const exitProgram = () => {
  process.exit();
};

const syntax = 'Wrong syntax: users.js create username, email password';

const handleCommandAsync = async () => {
  switch (command) {
    case COMMANDS.create: {
      if (args._.length !== 4) {
        console.error(syntax);
        break;
      }

      const username = args._[1];
      const email = args._[2];
      const password = args._[3];

      try {
        await connectMongoose();
        const user = await User.create({
          username,
          email,
          password,
        });
        console.log(`User with email ${user.email} successfully created`);
      } catch (err) {
        console.error(err);
      } finally {
        exitProgram();
      }
      break;
    }
    case COMMANDS.changePassword: {
      if (args._.length !== 3) {
        console.error(syntax);
        break;
      }

      const email = args._[1];
      const password = args._[2];

      try {
        await connectMongoose();
        const user = await User.findOne({ email });
        if (user) {
          user.set({ password });
          await user.save();
          console.log('Updated password successfully');
        } else {
          console.log('Could not find user');
        }
      } catch (err) {
        console.error(err);
      } finally {
        exitProgram();
      }

      break;
    }
    default:
      console.error('Wrong syntax: users.js create username, email password');
      break;
  }
};

handleCommandAsync();
