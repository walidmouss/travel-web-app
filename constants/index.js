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
    price: '$1,139/mo'
  },
  {
    name: 'Bali',
    url: '/islands/bali',
    image: '/bali.png',
    price: '$1,139/mo'
  },
  {
    name: 'Inca',
    url: '/hiking/inca',
    image: '/inca.png',
    price: '$1,139/mo'
  },
  {
    name: 'Paris',
    url: '/cities/paris',
    image: '/paris.png',
    price: '$1,139/mo'
  },
  {
    name: 'Rome',
    url: '/cities/rome',
    image: '/rome.png',
    price: '$1,139/mo'
  },
  {
    name: 'Santorini',
    url: '/islands/santorini',
    image: '/santorini.png',
    price: '$2,875/mo'
  }
];

module.exports = { ansiColors, places, locations };
