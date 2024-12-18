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
    description: 'Annapurna is a breathtaking massif located in the Himalayas of north-central Nepal, boasting stunning peaks, including one towering over 8,000 meters. It is a haven for trekkers and mountaineers, offering dramatic landscapes, rich biodiversity, and a deep connection to Nepali culture and traditions. Annapurna Circuit and Base Camp treks are among the most sought-after adventures in the world, blending natural beauty with an unforgettable cultural experience.',
    video: '/annapurna.mp4'
  },
  {
    name: 'Bali',
    url: '/islands/bali',
    image: '/bali.png',
    price: '$1,139/mo',
    background: '/background_bali.jpg',
    description: 'Bali, Indonesia\'s enchanting tropical island, is a paradise known for its lush forested volcanic mountains, breathtaking waterfalls, terraced rice paddies, and serene beaches fringed by coral reefs. Whether it\'s the vibrant nightlife of Kuta, the tranquil retreats of Ubud, or the sacred temples like Tanah Lot and Uluwatu, Bali offers a unique blend of relaxation and adventure. Visitors also enjoy its vibrant art scene, world-class surfing spots, and deeply spiritual Hindu culture.',
    video: '/bali.mp4'
  },
  {
    name: 'Inca',
    url: '/hiking/inca',
    image: '/inca.png',
    price: '$1,139/mo',
    background: '/background_inca.jpg',
    description: 'The Inca Trail is a legendary hiking route that meanders through the Andes, culminating at the iconic Machu Picchu, the ancient Incan citadel in Peru. Along the trail, hikers encounter awe-inspiring mountain vistas, lush cloud forests, and well-preserved archaeological sites that provide a glimpse into the advanced engineering and culture of the Inca Empire. The trek is a journey of both physical challenge and profound historical discovery, making it a bucket-list experience.',
    video: '/inca.mp4'
  },
  {
    name: 'Paris',
    url: '/cities/paris',
    image: '/paris.png',
    price: '$1,139/mo',
    background: '/background_paris.jpg',
    description: 'Paris, the enchanting capital of France, is a global hub of art, fashion, and gastronomy. Known as the "City of Light," it dazzles with its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral. Stroll through its charming cobblestone streets, indulge in world-renowned French cuisine, or relax in the elegant gardens of Luxembourg or Tuileries. Paris is a timeless city that seamlessly blends historical charm with modern sophistication.',
    video: 'https://www.youtube.com/embed/P3RWXEvaiwo?si=KQ8yW48PbGVB1_KO'
  },
  {
    name: 'Rome',
    url: '/cities/rome',
    image: '/rome.png',
    price: '$1,139/mo',
    background: '/background_rome.jpg',
    description: 'Rome, the eternal capital of Italy, boasts a history spanning nearly 3,000 years, making it one of the most culturally and historically significant cities in the world. The city is an open-air museum, home to iconic sites like the Colosseum, the Roman Forum, the Pantheon, and Vatican City. Beyond its ancient monuments, Rome offers a vibrant street life, exquisite Italian cuisine, and charming piazzas that reflect its warm, lively spirit. Experience a city where every corner tells a story.',
    video: '/rome.mp4'
  },
  {
    name: 'Santorini',
    url: '/islands/santorini',
    image: '/santorini.png',
    price: '$2,875/mo',
    background: '/background3.jpg',
    description: 'Santorini, a gem of the Aegean Sea, captivates visitors with its stunning turquoise waters, whitewashed buildings with blue-domed roofs, and dramatic volcanic cliffs. Famous for its breathtaking sunsets over the caldera, Santorini offers a wealth of activities, from wine-tasting tours at local vineyards to exploring ancient archaeological sites like Akrotiri. Its idyllic setting, coupled with authentic Greek cuisine and proximity to other islands for hopping adventures, makes it one of the most popular destinations for travelers seeking romance and relaxation.',
    video: 'https://www.youtube.com/embed/O3U7vAVUca0?si=KyYRGD8XIGS6N3si'
  }
];

module.exports = { ansiColors, places, locations };
