/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0D',
        surface: '#141419',
        border: 'rgba(243,244,247,0.1)',
        ink: '#F3F4F7',
        muted: '#8B8D98',
        cyan: '#2FE8DC',
        pink: '#FF3EA5',
        mint: '#7BF3EA',
        violet: '#C792EA',
        amber: '#FFB84D',
      },
      fontFamily: {
        heading: ['SpaceGrotesk_700Bold'],
        'heading-medium': ['SpaceGrotesk_500Medium'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
        mono: ['IBMPlexMono_500Medium'],
        'mono-semibold': ['IBMPlexMono_600SemiBold'],
      },
    },
  },
  plugins: [],
};
