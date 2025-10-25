module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo'], 'nativewind/babel'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@store': './src/store',
            '@services': './src/services',
            '@types': './src/types',
            '@theme': './src/theme',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@controllers': './src/controllers',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
