export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/assetsMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^config$': '<rootDir>/__mocks__/config.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    'main.jsx',
    'config.js',
    'app/App.jsx',
    'app.routes/App.routes.jsx',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
