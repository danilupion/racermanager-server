/* eslint-disable no-console */

const connectMongoose = require('../helpers/mongoose');
const {
  User,
  Season,
  Team,
  Driver,
  Circuit,
  GrandPrix,
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
const SEASON_2018 = '2018';
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
    name: 'Brendon Hartley',
    countryCode: 'NZL',
    code: 'HAR',
  },
  {
    name: 'Charles Leclerc',
    countryCode: 'MCO',
    code: 'LEC',
  },
  {
    name: 'Sergey Sirotkin',
    countryCode: 'RUS',
    code: 'SIR',
  },
];

const F1_2018_CIRCUITS = [
  {
    name: 'Circuito de Albert Park',
    countryCode: 'AUS',
    latitude: -37.849722,
    longitude: 144.968333,
  },
  {
    name: 'Circuito Internacional de Baréin',
    countryCode: 'BHR',
    latitude: 26.0325,
    longitude: 50.510556,
  },
  {
    name: 'Circuito Internacional de Shanghái',
    countryCode: 'CHN',
    latitude: 31.338889,
    longitude: 121.219722,
  },
  {
    name: 'Circuito Urbano de Bakú',
    countryCode: 'AZE',
    latitude: 40.3725,
    longitude: 49.853333,
  },
  {
    name: 'Circuito de Barcelona-Cataluña',
    countryCode: 'ESP',
    latitude: 41.57,
    longitude: 2.261111,
  },
  {
    name: 'Circuito de Mónaco',
    countryCode: 'MCO',
    latitude: 43.734722,
    longitude: 7.420556,
  },
  {
    name: 'Circuito Gilles Villeneuve',
    countryCode: 'CAN',
    latitude: 45.500578,
    longitude: -73.522461,
  },
  {
    name: 'Circuito Paul Ricard',
    countryCode: 'FRA',
    latitude: 43.250556,
    longitude: 5.791667,
  },
];

const F1_2018_GRANDS_PRIX = [
  {
    name: 'Australia',
    countryCode: 'AUS',
  },
  {
    name: 'Baréin',
    countryCode: 'BHR',
  },
  {
    name: 'China',
    countryCode: 'CHN',
  },
  {
    name: 'Azerbaiyán',
    countryCode: 'AZE',
  },
  {
    name: 'España',
    countryCode: 'ESP',
  },
  {
    name: 'Mónaco',
    countryCode: 'MCO',
  },
  {
    name: 'Canadá',
    countryCode: 'CAN',
  },
  {
    name: 'Francia',
    countryCode: 'FRA',
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
  const data = {
    name: SEASON_2018,
    championship: F1_CHAMPIONSHIP,
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

        console.log(`Team ${team.name} was ${created ? 'created' : 'skipped'}`);
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

const createF1CircuitsAsync = async () => {
  await Promise.all(
    F1_2018_CIRCUITS.map(
      async (circuit) => {
        const created = await createIfNotPresent(
          Circuit,
          {
            ...circuit,
            championship: F1_CHAMPIONSHIP,
          }
        );

        console.log(`Circuit ${circuit.name} was ${created ? 'created' : 'skipped'}`);
      }
    )
  );
};

const createF1GrandsPrixAsync = async () => {
  await Promise.all(
    F1_2018_GRANDS_PRIX.map(
      async (grandPrix) => {
        const created = await createIfNotPresent(
          GrandPrix,
          {
            ...grandPrix,
            championship: F1_CHAMPIONSHIP,
          }
        );

        console.log(`Grand Prix ${grandPrix.name} was ${created ? 'created' : 'skipped'}`);
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
      createF1CircuitsAsync(),
      createF1GrandsPrixAsync(),
    ]);
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit();
  }
};

seedDatabaseAsync();
