/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",  // Key for App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'from-indigo-50',
    'via-purple-50',
    'to-pink-50',
    'shadow-xl',
    'shadow-2xl',
    'shadow-3xl',
    'rounded-3xl',
    'hover:-translate-y-4',
    'hover:scale-105',
    'animate-pulse',
    'backdrop-blur-xl',
    'border-white/50',
    'text-transparent',
    'bg-clip-text',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
