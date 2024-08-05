export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-custom-properties-fallback": {
      importFrom: require.resolve("react-spring-bottom-sheet/defaults.json"),
    },
  },
};
