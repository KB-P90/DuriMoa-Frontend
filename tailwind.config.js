/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './**/*.{vue,js,ts,jsx,tsx}', '!./node_modules/**'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        'dm-mint': {
          lighter: '#FAFFFF',
          light: '#EBF7F7',
          DEFAULT: '#D0ECEB',
          dark: '#9DCACD',
          darker: '#15AEA9',
        },
        'dm-rose': {
          light: '#F8DFDB',
          DEFAULT: '#F6C6C1',
          dark: '#D79A95',
        },
        'dm-co': {
          lighter: '#F8C9BE',
          light: '#FFBFA1',
          DEFAULT: '#F2A390',
          dark: '#FFA28C',
          darker: '#D17C69',
        },
        'dm-cb': {
          light: '#FFF8F8',
          DEFAULT: '#FBE6E5',
          dark: '#E6BFBC',
        },
        'btn-pk': {
          DEFAULT: '#FF8F84',
          dark: '#FF6E70',
        },
        'btn-mt': {
          DEFAULT: '#EBF7F7',
          dark: '#1f716e',
          darker: '#227f7c',
        },
        'dm-gray': {
          light: '#F7F7FA',
          DEFAULT: '#B9B9C4',
          dark: '#9293A2',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
