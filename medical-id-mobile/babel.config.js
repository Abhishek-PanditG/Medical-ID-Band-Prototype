module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',   // import like: import { BACKEND_URL } from '@env';
          path: '.env',          // path to your .env file
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ]
    ]
  };
};
