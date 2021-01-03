module.exports = {
  root: true,
  extends: ['prettier', '@react-native-community'],
  plugins: ['prettier'],
  rules: {
    // curly: ['all'],
    'prettier/prettier': 'error',
    'react-native/no-inline-styles': 0,
  },
};
