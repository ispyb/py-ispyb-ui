/**
 * Converts wavelength to Energy
 * @param {wavelength}
 * @return {energy}
 */
export function wavelengthToEnergy(wavelength) {
  return Number(12.398 / wavelength);
}

/**
 * Replace toFixed function with some additional checks
 *
 */
export function convertToFixed(value, fixed) {
  if (value) {
    try {
      return parseFloat(value).toFixed(fixed);
    } catch (e) {
      return 'NA';
    }
  }
  return '';
}

export function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
}

export function convertToExponential(value, decimals) {
  if (value) {
    try {
      return parseFloat(value).toExponential(decimals);
    } catch (e) {
      return 'NA';
    }
  }
  return '';
}

export function multiply(value, multiplier) {
  if (value) {
    try {
      return value * multiplier;
    } catch (e) {
      return 'NA';
    }
  }
  return '';
}

export function commaSeparatedToNumberArray(commaSeparatedString) {
  if (commaSeparatedString) {
    return commaSeparatedString.split(',').map(function (e) {
      return Number(e);
    });
  }
  return [];
}
