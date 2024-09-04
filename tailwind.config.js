/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        '80-screen': '80vh', // Custom class max-h-80-screen will set max-height to 80% of the viewport height
      },
    },
  },
  plugins: [],
};
