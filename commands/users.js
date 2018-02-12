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

switch (command) {
  case COMMANDS.create: {
    if (args._.length !== 4) {
      console.error('Wrong syntax: users.js create username, email password');
      break;
    }

    const username = args._[1];
    const email = args._[2];
    const password = args._[3];

    connectMongoose()
      .then(() => User.create({
        username,
        email,
        password,
      }))
      .then(user => console.log(`User with email ${user.email} successfully created`))
      .catch(console.error)
      .then(exitProgram);

    break;
  }
  case COMMANDS.changePassword: {
    if (args._.length !== 3) {
      console.error('Wrong syntax: users.js change-password email password');
      break;
    }

    const email = args._[1];
    const password = args._[2];

    connectMongoose()
      .then(() => User.findOne({ email }))
      .then((user) => {
        if (!user) {
          throw new Error('Could not find email');
        }

        user.set({ password });

        // eslint-disable-next-line consistent-return
        return user.save();
      })
      .then(() => console.log('Updated password successfully'))
      .catch(console.error)
      .then(exitProgram);

    break;
  }
  default:
    console.error(`Unrecognized command, syntax ${command}`);
    break;
}
