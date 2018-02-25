/* eslint-disable no-console */

const connectMongoose = require('../helpers/mongoose');
const {
  User,
  Season,
  Team,
  Driver,
} = require('../models');

const USERS = [
  {
    username: 'admin',
    email: 'admin@racermanager.com',
    password: 'admin',
    role: User.ROLES.admin,
  },
  {
    username: 'user',
    email: 'user@racermanager.com',
    password: 'user',
    role: User.ROLES.user,
  },
];
const F1_2018_SEASON = 'F1-2018';
const F1_CHAMPIONSHIP = 'F1';
const F1_2018_TEAMS = [
  'Ferrari',
  'Force India',
  'Haas',
  'McLaren',
  'Mercedes',
  'Red Bull',
  'Renault',
  'Sauber',
  'Toro Rosso',
  'Williams',
];

const F1_2018_DRIVERS = [
  {
    name: 'Lewis Hamilton',
    code: 'HAM',
  },
  {
    name: 'Sebastina Vettel',
    code: 'VET',
  },
  {
    name: 'Valtteri Bottas',
    code: 'BOT',
  },
  {
    name: 'Kimi Räikkönen',
    code: 'RAI',
  },
];

const createIfNotPresent = async (Model, data, {
  saveData = data,
  validateBeforeSave = true,
} = {}) => {
  const existingModel = await Model.findOne(data);

  if (!existingModel) {
    await (new Model(saveData)).save({ validateBeforeSave });
  }

  return !existingModel;
};

const createUsersAsync = async () => {
  await Promise.all(
    USERS.map(
      async (user) => {
        const { password, ...dataWithoutPassword } = user;

        const created = await createIfNotPresent(
          User,
          dataWithoutPassword,
          {
            saveData: user,
            validateBeforeSave: false,
          }
        );

        console.log(`User ${user.username} was ${created ? 'created' : 'skipped'}`);
      }
    )
  );
};

const createCurrentF12018SeasonAsync = async () => {
  const from = new Date('2018-01-01T00:00:00.000Z');
  const to = new Date('2018-12-31T23:59:59.999Z');

  const data = {
    name: F1_2018_SEASON,
    championship: F1_CHAMPIONSHIP,
    from,
    to,
  };

  const created = await createIfNotPresent(Season, data);

  console.log(`Season ${data.name} was ${created ? 'created' : 'skipped'}`);
};

const createF1TeamsAsync = async () => {
  await Promise.all(
    F1_2018_TEAMS.map(
      async (team) => {
        const created = await createIfNotPresent(
          Team,
          {
            name: team,
            championship: F1_CHAMPIONSHIP,
          },
        );

        console.log(`Team ${team} was ${created ? 'created' : 'skipped'}`);
      }
    )
  );
};

const createF1DriversAsync = async () => {
  await Promise.all(
    F1_2018_DRIVERS.map(
      async (driver) => {
        const created = await createIfNotPresent(
          Driver,
          {
            ...driver,
            championship: F1_CHAMPIONSHIP,
          },
        );

        console.log(`Driver ${driver.name} was ${created ? 'created' : 'skipped'}`);
      }
    )
  );
};

const seedDatabaseAsync = async () => {
  try {
    await connectMongoose();

    await Promise.all([
      createUsersAsync(),
      createCurrentF12018SeasonAsync(),
      createF1TeamsAsync(),
      createF1DriversAsync(),
    ]);
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit();
  }
};

seedDatabaseAsync();
