const ansiColors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

const places = [
  { 
    name: "annapuna", 
    url: "/hiking/annapuna" 
  },
  { 
    name: "bali", 
    url: "/islands/bali" 
  },
  { 
    name: "inca", 
    url: "/hiking/inca" 
  },
  { 
    name: "paris", 
    url: "/cities/paris" 
  },
  { 
    name: "rome", 
    url: "/cities/rome" 
  },
  { 
    name: "santorini", 
    url: "/islands/santorini" 
  },
];

const locations = [
  {
    name: 'Annapurna',
    url: '/hiking/annapurna',
    image: '/annapurna.png',
    price: '$1,139/mo',
    background: '/background_annapurna.jpg',
    description: 'Annapurna is a massif in the Himalayas in north-central Nepal that includes one peak over 8,000 meters.',
    video: '/annapurna.mp4'
  },
  {
    name: 'Bali',
    url: '/islands/bali',
    image: '/bali.png',
    price: '$1,139/mo',
    background: '/background_bali.jpg',
    description: 'Bali, Indonesia\'s famous tropical island, is known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
    video: '/bali.mp4'
  },
  {
    name: 'Inca',
    url: '/hiking/inca',
    image: '/inca.png',
    price: '$1,139/mo',
    background: '/background_inca.jpg',
    description: 'The Inca Trail is a hiking route that leads to Machu Picchu, the famous Incan citadel in Peru.',
    video: '/inca.mp4'
  },
  {
    name: 'Paris',
    url: '/cities/paris',
    image: '/paris.png',
    price: '$1,139/mo',
    background: '/background_paris.jpg',
    description: 'Paris, France\'s capital, is a major European city known for its art, fashion, gastronomy, and culture.',
    video: '/paris.mp4'
  },
  {
    name: 'Rome',
    url: '/cities/rome',
    image: '/rome.png',
    price: '$1,139/mo',
    background: '/background_rome.jpg',
    description: 'Rome, the capital of Italy, is known for its nearly 3,000 years of globally influential art, architecture, and culture.',
    video: '/rome.mp4'
  },
  {
    name: 'Santorini',
    url: '/islands/santorini',
    image: '/santorini.png',
    price: '$2,875/mo',
    background: '/background3.jpg',
    description: 'With its stunning turquoise waters and picturesque villages, great activities including wine-tasting, authentic Greek cuisine, regular boat excursions due to its ideal location for island hopping, the small Greek island of Santorini became so popular as a holiday destination.',
    video: '/santorini.mp4'
  }
];

module.exports = { ansiColors, places, locations };
