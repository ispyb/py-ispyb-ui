export function rainbow(
  val: number,
  width: number = 126,
  centre: number = 127
) {
  const col = val * 2 * Math.PI;
  return (
    'rgb(' +
    Math.floor(Math.sin(col) * width + centre) +
    ',' +
    Math.floor(Math.sin(col + (2 * Math.PI) / 3) * width + centre) +
    ',' +
    Math.floor(Math.sin(col + (4 * Math.PI) / 3) * width + centre) +
    ')'
  );
}

export function getColors(count: number) {
  return (
    Array(count)
      .fill(0)
      // .map((_, i) => `hsl(${(i * 360) / count}, 0.9, 0.4)`);
      .map((_, i) => hslToHex((i * 360) / count, 90, 40))
  );
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function shuffle(array: Array<any>) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
