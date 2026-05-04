// src/shared/utils/getCenter.ts

export function getCenter(points: { lat: number; lng: number }[]) {
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;

  return { lat, lng };
}
