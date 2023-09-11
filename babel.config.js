module.exports = {
  // ...
  plugins: [
    // ... other plugins
    [
      'babel-plugin-module-resolver',
      {
        root: './',
        alias: {
          "lib": "./src/lib"
        },
      },
    ],
  ],
  presets: [ '@babel/preset-env', '@babel/preset-typescript' ]
}
