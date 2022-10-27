module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-react-shamsi`
  extends: ["react-shamsi"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
