module.exports = {
  // ...
  plugins: [
    // ... other plugins
    [
      'babel-plugin-module-resolver',
      {
        root: './',
        alias: {
          "types": "./src/types",
          "utils": "./src/utils"
        },
      },
    ],
  ],
}
