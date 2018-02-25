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
  {
    name: 'Ferrari',
    countryCode: 'ITA',
  },
  {
    name: 'Force India',
    countryCode: 'IND',
  },
  {
    name: 'Haas F1 Team',
    countryCode: 'USA',
  },
  {
    name: 'McLaren',
    countryCode: 'GBR',
  },
  {
    name: 'Mercedes',
    countryCode: 'GER',
  },
  {
    name: 'Red Bull Racing',
    countryCode: 'AUT',
  },
  {
    name: 'Renault',
    countryCode: 'FRA',
  },
  {
    name: 'Sauber',
    countryCode: 'CHE',
  },
  {
    name: 'Toro Rosso',
    countryCode: 'ITA',
  },
  {
    name: 'Williams',
    countryCode: 'GBR',
  },
];

const F1_2018_DRIVERS = [
  {
    name: 'Lewis Hamilton',
    countryCode: 'GBR',
    code: 'HAM',
  },
  {
    name: 'Sebastina Vettel',
    countryCode: 'GER',
    code: 'VET',
  },
  {
    name: 'Valtteri Bottas',
    countryCode: 'FIN',
    code: 'BOT',
  },
  {
    name: 'Kimi Räikkönen',
    countryCode: 'FIN',
    code: 'RAI',
  },
  {
    name: 'Daniel Ricciardo',
    countryCode: 'AUS',
    code: 'RIC',
  },
  {
    name: 'Max Verstappen',
    countryCode: 'NED',
    code: 'VER',
  },
  {
    name: 'Sergio Perez',
    countryCode: 'MEX',
    code: 'PER',
  },
  {
    name: 'Esteban Ocon',
    countryCode: 'FRA',
    code: 'OCO',
  },
  {
    name: 'Carlos Sainz',
    countryCode: 'ESP',
    code: 'SAI',
  },
  {
    name: 'Nico Hulkenberg',
    countryCode: 'GER',
    code: 'HUL',
  },
  {
    name: 'Felipe Massa',
    countryCode: 'BRA',
    code: 'MAS',
  },
  {
    name: 'Lance Stroll',
    countryCode: 'CAN',
    code: 'STR',
  },
  {
    name: 'Romain Grosjean',
    countryCode: 'FRA',
    code: 'GRO',
  },
  {
    name: 'Kevin Magnussen',
    countryCode: 'DEN',
    code: 'MAG',
  },
  {
    name: 'Fernando Alonso',
    countryCode: 'ESP',
    code: 'ALO',
  },
  {
    name: 'Stoffel Vandoorne',
    countryCode: 'BEL',
    code: 'VAN',
  },
  {
    name: 'Jolyon Palmer',
    countryCode: 'GBR',
    code: 'PAL',
  },
  {
    name: 'Pascal Wehrlein',
    countryCode: 'GER',
    code: 'WEH',
  },
  {
    name: 'Daniil Kvyat',
    countryCode: 'RUS',
    code: 'KVY',
  },
  {
    name: 'Marcus Ericsson',
    countryCode: 'SWE',
    code: 'ERI',
  },
  {
    name: 'Pierre Gasly',
    countryCode: 'FRA',
    code: 'GAS',
  },
  {
    name: 'Antonio Giovinazzi',
    countryCode: 'ITA',
    code: 'GIO',
  },
  {
    name: 'Brendon Hartley',
    countryCode: 'NZL',
    code: 'HAR',
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
            ...team,
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
