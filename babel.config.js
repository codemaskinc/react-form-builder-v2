module.exports = {
  // ...
  plugins: [
    // ... other plugins
    [
      'babel-plugin-module-resolver',
      {
        root: './',
        alias: {
          "types": "./src/lib/types",
          "utils": "./src/lib/utils"
        },
      },
    ],
  ],
}
