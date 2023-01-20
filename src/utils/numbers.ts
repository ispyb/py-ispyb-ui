export function round(value: any, precision: number) {
  if (value === undefined || value === null) return;
  if (isNaN(value)) return value;

  return (
    Math.round(parseFloat(value) * Math.pow(10, precision)) /
    Math.pow(10, precision)
  );
}

export function toEnergy(wavelength: number) {
  return wavelength > 0
    ? (
        ((6.62607004e-34 * 2.99792458e8) / (wavelength * 1e-10) / 1.60218e-19) *
        1e-3
      ).toFixed(4)
    : 0;
}
