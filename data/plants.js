export const plantImages = {
  monstera: require('../assets/plants/monstera-generated.png'),
  ficus: require('../assets/plants/ficus-generated.png'),
  basilic: require('../assets/plants/basilic-generated.png'),
  pothos: require('../assets/plants/pothos-generated.png'),
};

export const botanicalBackground = require('../assets/botanical-background.png');

export const defaultPlants = [
  {
    id: 'monstera',
    name: 'Monstera',
    species: 'Deliciosa',
    room: 'Salon',
    category: 'Interieur',
    imageKey: 'monstera',
    favorite: true,
    humidity: 54,
    light: 'Lumiere indirecte',
    nextWatering: 'Demain',
    frequency: '7 jours',
    mood: 'Stable',
    accent: '#CFE8A9',
    description: 'Grand feuillage tropical, ideal pour une piece lumineuse sans soleil direct.',
    tips: [
      'Tournez le pot toutes les deux semaines pour une croissance reguliere.',
      'Laissez secher la surface du terreau avant un nouvel arrosage.',
      'Nettoyez les grandes feuilles pour aider la photosynthese.',
    ],
    compatible: ['Pothos dore', 'Calathea', 'Philodendron'],
  },
  {
    id: 'ficus',
    name: 'Ficus',
    species: 'Elastica',
    room: 'Bureau',
    category: 'Interieur',
    imageKey: 'ficus',
    favorite: false,
    humidity: 39,
    light: 'Lumiere filtree',
    nextWatering: 'Dans 2 j',
    frequency: '10 jours',
    mood: 'A suivre',
    accent: '#E6D8A8',
    description: 'Feuilles epaisses et brillantes, prefere une place stable et une lumiere douce.',
    tips: [
      'Evitez de le deplacer trop souvent, il prefere une routine stable.',
      'Augmentez legerement l humidite si les bords brunissent.',
      'Un pot perce aide a eviter l eau stagnante.',
    ],
    compatible: ['Sansevieria', 'Pilea', 'Zamioculcas'],
  },
  {
    id: 'basilic',
    name: 'Basilic',
    species: 'Grand vert',
    room: 'Cuisine',
    category: 'Herbes',
    imageKey: 'basilic',
    favorite: true,
    humidity: 63,
    light: 'Soleil doux',
    nextWatering: 'Ce soir',
    frequency: '2 jours',
    mood: 'En forme',
    accent: '#B9E87E',
    description: 'Herbe aromatique lumineuse, demande un terreau frais et des tailles regulieres.',
    tips: [
      'Pincez les extremites pour encourager une plante plus dense.',
      'Gardez le terreau legerement humide sans le detremper.',
      'Placez-le pres d une fenetre lumineuse.',
    ],
    compatible: ['Persil', 'Menthe', 'Ciboulette'],
  },
  {
    id: 'pothos',
    name: 'Pothos',
    species: 'Dore',
    room: 'Entree',
    category: 'Ombre',
    imageKey: 'pothos',
    favorite: true,
    humidity: 47,
    light: 'Ombre claire',
    nextWatering: 'Vendredi',
    frequency: '9 jours',
    mood: 'Tolerant',
    accent: '#D8E986',
    description: 'Plante retombante tres facile, parfaite pour les coins a lumiere indirecte.',
    tips: [
      'Taillez les longues tiges pour garder une forme compacte.',
      'Ses panachures aiment une lumiere douce.',
      'Un arrosage trop frequent jaunit souvent les feuilles.',
    ],
    compatible: ['Monstera', 'Spathiphyllum', 'Peperomia'],
  },
];

export function withImage(plant) {
  return {
    ...plant,
    image: plant.photoUri ? { uri: plant.photoUri } : plantImages[plant.imageKey] ?? plantImages.monstera,
  };
}

export function fromDatabase(row) {
  return withImage({
    id: row.id,
    name: row.name,
    species: row.species,
    room: row.room,
    category: row.category,
    imageKey: row.image_key || 'monstera',
    photoUri: row.photo_uri,
    favorite: row.favorite,
    humidity: row.humidity,
    light: row.light,
    nextWatering: row.next_watering,
    frequency: row.frequency,
    mood: row.mood,
    accent: row.accent || '#CFE8A9',
    description: row.description,
    tips: row.tips || [],
    compatible: row.compatible || [],
  });
}

export function toDatabase(plant, userId) {
  return {
    user_id: userId,
    name: plant.name,
    species: plant.species,
    room: plant.room,
    category: plant.category,
    image_key: plant.imageKey,
    photo_uri: plant.photoUri,
    favorite: plant.favorite,
    humidity: plant.humidity,
    light: plant.light,
    next_watering: plant.nextWatering,
    frequency: plant.frequency,
    mood: plant.mood,
    accent: plant.accent,
    description: plant.description,
    tips: plant.tips,
    compatible: plant.compatible,
  };
}
