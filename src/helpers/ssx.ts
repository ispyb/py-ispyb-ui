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

export function getColorFromIndexedPercent(indexedPercent: number) {
  return lightenDarkenColor(getColorFromHitPercent(indexedPercent), -40);
}

function lightenDarkenColor(col: string, amt: number) {
  let usePound = false;
  if (col[0] == '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}
