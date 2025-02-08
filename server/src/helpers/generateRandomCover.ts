const coverImages = [
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover1_h28tl3.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover2_tqh446.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover3_soq0xt.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover4_d5j1re.webp',
];

export const getRandomCover = (): string => {
  const randomIndex = Math.floor(Math.random() * coverImages.length);
  return coverImages[randomIndex];
};
