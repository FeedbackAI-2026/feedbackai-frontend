import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ooredoo: {
          red: '#E60000',
          darkred: '#B00000',
          ink: '#14142B',
          mist: '#F6F7FB',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(20, 20, 43, 0.08)',
        card: '0 4px 20px rgba(230, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
