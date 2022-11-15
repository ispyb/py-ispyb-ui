export function getColorFromHitPercent(hitPercent: number) {
  if (hitPercent >= 30) {
    return '#71db44';
  } else if (hitPercent >= 10) {
    return '#a2cf4e';
  } else if (hitPercent >= 2) {
    return '#edc132';
  }
  return '#c9483e';
}
