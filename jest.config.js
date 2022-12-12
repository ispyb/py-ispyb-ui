const DEPS_TO_TRANSFORM = [
  'd3-array',
  'd3-color',
  'd3-format',
  'd3-interpolate',
  'd3-scale-chromatic',
  'internmap',
  'three',
];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  roots: ['<rootDir>/src'],
  //   preset: 'ts-jest/presets/js-with-ts',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${DEPS_TO_TRANSFORM.join('|')}))`,
  ],
};

module.exports = config;
