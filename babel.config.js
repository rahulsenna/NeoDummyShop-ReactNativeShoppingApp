module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
        [
           'module-resolver',
           {
             root: ['./'],
             extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
             alias: {
               tests: ['./tests/'],
               "@components": "./src/components",
               "@screens": "./src/screens",
               "@constants": "./src/constants",
               "@my_types": "./src/types",
               "@app": "./App",
               "@apis": "./src/utils/apis",
               "@styles": "./src/styles",
             }
           }
        ]
      ]
};
