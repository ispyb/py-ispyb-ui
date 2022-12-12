export function round(value: any, precision: number) {
  if (value === undefined || value === null) return;
  if (isNaN(value)) return value;

  return (
    Math.round(parseFloat(value) * Math.pow(10, precision)) /
    Math.pow(10, precision)
  );
}
