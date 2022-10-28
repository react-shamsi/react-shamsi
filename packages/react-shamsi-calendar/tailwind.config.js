/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../packages/react-shamsi-calendar/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vazirmatn: ["Vazirmatn", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
