import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                burgundy: {
                    dark: '#2B1B2E',
                    mid: '#3D1F32',
                },
                teal: {
                    dark: '#1E4D4D',
                    mid: '#2A6565',
                    accent: '#3B8B8B',
                },
                pumpkin: {
                    orange: '#FF8C1A',
                    dark: '#CC5E13',
                },
            },
            fontFamily: {
                heading: ['var(--font-nunito)'],
                body: ['var(--font-open-sans)'],
                code: ['var(--font-fira-code)'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'wave': 'wave 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                wave: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(10px)' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
