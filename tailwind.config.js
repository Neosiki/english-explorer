/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1f2430',
        sunny: '#ffb703',
        sky: '#4cc9f0',
      },
    },
  },
  plugins: [],
};
