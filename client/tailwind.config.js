/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : '#8696FE'
      },
    },
  },
  plugins: [],
  corePlugins  : {
    preflight : false
  }
}

