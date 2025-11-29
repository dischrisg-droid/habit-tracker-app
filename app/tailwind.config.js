module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'shadow-xl',
    'shadow-2xl',
    'shadow-3xl',
    'rounded-3xl',
    'hover:-translate-y-4',
    'hover:scale-105',
    'animate-pulse',
    'from-indigo-50',
    'via-purple-50',
    'to-pink-50',
    // Add any other classes that aren't showing up
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
