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
    name: 'Red Bull',
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
  {
    name: 'Red Bull Ring',
    countryCode: 'AUT',
    latitude: 47.219722,
    longitude: 14.764722,
  },
  {
    name: 'Circuito de Silverstone',
    countryCode: 'GBR',
    latitude: 52.078611,
    longitude: -1.016944,
  },
  {
    name: 'Hockenheimring',
    countryCode: 'DEU',
    latitude: 49.327778,
    longitude: 8.565833,
  },
  {
    name: 'Hungaroring',
    countryCode: 'HUN',
    latitude: 47.582222,
    longitude: 19.251111,
  },
  {
    name: 'Circuito de Spa-Francorchamps',
    countryCode: 'BEL',
    latitude: 50.437222,
    longitude: 5.971389,
  },
  {
    name: 'Autodromo Nazionale di Monza',
    countryCode: 'ITA',
    latitude: 45.620556,
    longitude: 9.289444,
  },
  {
    name: 'Circuito callejero de Marina Bay',
    countryCode: 'SGP',
    latitude: 1.291531,
    longitude: 103.86385,
  },
  {
    name: 'Autódromo de Sochi',
    countryCode: 'RUS',
    latitude: 43.410278,
    longitude: 39.968271,
  },
  {
    name: 'Circuito de Suzuka',
    countryCode: 'JAP',
    latitude: 34.843056,
    longitude: 136.540556,
  },
  {
    name: 'Circuito de las Américas',
    countryCode: 'USA',
    latitude: 30.132778,
    longitude: -97.641111,
  },
  {
    name: 'Autódromo Hermanos Rodríguez',
    countryCode: 'MEX',
    latitude: 19.406111,
    longitude: -99.0925,
  },
  {
    name: 'Autódromo José Carlos Pace',
    countryCode: 'BRA',
    latitude: -23.701111,
    longitude: -46.697222,
  },
  {
    name: 'Circuito Yas Marina',
    countryCode: 'ARE',
    latitude: 24.467222,
    longitude: 54.603056,
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
  {
    name: 'Austria',
    countryCode: 'AUT',
  },
  {
    name: 'Gran Bretaña',
    countryCode: 'GBR',
  },
  {
    name: 'Alemania',
    countryCode: 'DEU',
  },
  {
    name: 'Hungría',
    countryCode: 'HUN',
  },
  {
    name: 'Bélgica',
    countryCode: 'BEL',
  },
  {
    name: 'Italia',
    countryCode: 'iITA',
  },
  {
    name: 'Singapur',
    countryCode: 'SGP',
  },
  {
    name: 'Rusia',
    countryCode: 'RUS',
  },
  {
    name: 'Japón',
    countryCode: 'JAP',
  },
  {
    name: 'Estados Unidos',
    countryCode: 'USA',
  },
  {
    name: 'México',
    countryCode: 'MEX',
  },
  {
    name: 'Brasil',
    countryCode: 'BRA',
  },
  {
    name: 'Abu Dabi',
    countryCode: 'ARE',
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
  const drivers = (await Driver.find().exec()).reduce(
    (accumulated, driver) => ({
      ...accumulated,
      [driver.code]: driver,
    }),
    {}
  );

  const teams = (await Team.find().exec()).reduce(
    (accumulated, team) => ({
      ...accumulated,
      [team.name]: team,
    }),
    {}
  );

  const seasonTeams = [
    {
      team: teams.Mercedes,
      countryCode: 'DEU',
      name: 'Mercedes GP',
      drivers: [
        {
          driver: drivers.HAM,
          initialValue: 75,
        },
        {
          driver: drivers.BOT,
          initialValue: 65,
        },
      ],
    },
    {
      team: teams.Ferrari,
      countryCode: 'ITA',
      name: 'Ferrari',
      drivers: [
        {
          driver: drivers.VET,
          initialValue: 70,
        },
        {
          driver: drivers.RAI,
          initialValue: 60,
        },
      ],
    },
    {
      team: teams['Red Bull'],
      countryCode: 'AUT',
      name: 'Red Bull Racing',
      drivers: [
        {
          driver: drivers.RIC,
          initialValue: 55,
        },
        {
          driver: drivers.VER,
          initialValue: 50,
        },
      ],
    },
    {
      team: teams['Force India'],
      countryCode: 'IND',
      name: 'Force India',
      drivers: [
        {
          driver: drivers.PER,
          initialValue: 50,
        },
        {
          driver: drivers.OCO,
          initialValue: 40,
        },
      ],
    },
    {
      team: teams.Williams,
      countryCode: 'GBR',
      name: 'Williams',
      drivers: [
        {
          driver: drivers.STR,
          initialValue: 50,
        },
        {
          driver: drivers.SIR,
          initialValue: 40,
        },
      ],
    },
    {
      team: teams.Renault,
      countryCode: 'FRA',
      name: 'Renault',
      drivers: [
        {
          driver: drivers.HUL,
          initialValue: 50,
        },
        {
          driver: drivers.SAI,
          initialValue: 45,
        },
      ],
    },
    {
      team: teams['Toro Rosso'],
      countryCode: 'ITA',
      name: 'Toro Rosso',
      drivers: [
        {
          driver: drivers.GAS,
          initialValue: 40,
        },
        {
          driver: drivers.HAR,
          initialValue: 35,
        },
      ],
    },
    {
      team: teams['Haas F1 Team'],
      countryCode: 'USA',
      name: 'Haas F1 Team',
      drivers: [
        {
          driver: drivers.GRO,
          initialValue: 40,
        },
        {
          driver: drivers.MAG,
          initialValue: 35,
        },
      ],
    },
    {
      team: teams.McLaren,
      countryCode: 'GBR',
      name: 'McLaren',
      drivers: [
        {
          driver: drivers.ALO,
          initialValue: 40,
        },
        {
          driver: drivers.VAN,
          initialValue: 35,
        },
      ],
    },
    {
      team: teams.Sauber,
      countryCode: 'GBR',
      name: 'Sauber',
      drivers: [
        {
          driver: drivers.ERI,
          initialValue: 30,
        },
        {
          driver: drivers.LEC,
          initialValue: 25,
        },
      ],
    },
  ];

  const data = {
    name: SEASON_2018,
    championship: F1_CHAMPIONSHIP,
    drivers: seasonTeams.reduce((accumulated, team) => [...accumulated, ...team.drivers], []),
    teams: seasonTeams.map(team => ({
      ...team,
      drivers: team.drivers.map(driver => driver.driver),
    })),
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
      createF1TeamsAsync(),
      createF1DriversAsync(),
      createF1CircuitsAsync(),
      createF1GrandsPrixAsync(),
    ]);

    await Promise.all([
      createCurrentF12018SeasonAsync(),
    ]);
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit();
  }
};

seedDatabaseAsync();
