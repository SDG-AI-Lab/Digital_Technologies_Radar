const fallbackImages = [
  'fallback/globe.png',
  'fallback/world-map.png',
  'fallback/tech.png'
];

export function assignRandomFallbackImage(): string {
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[randomIndex];
}
