export function getColorFromHitPercent(hitPercent: number) {
  if (hitPercent >= 75) {
    return '#71db44';
  } else if (hitPercent >= 50) {
    return '#a2cf4e';
  } else if (hitPercent >= 25) {
    return '#edc132';
  }
  return '#c9483e';
}
