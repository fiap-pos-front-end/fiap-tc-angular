const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "fiap-tc-angular",

  exposes: {
    "./routes": "./src/app/app.routes.ts",
  },

  remotes: {
    mfeShell: "http://localhost/fiap-tc-shell/remoteEntry.js",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
