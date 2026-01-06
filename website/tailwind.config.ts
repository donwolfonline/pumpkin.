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
                    DEFAULT: '#520E38',
                    mid: '#3D1F32',
                    light: '#7A1F55',
                },
                teal: {
                    DEFAULT: '#266150',
                    mid: '#327A66',
                    accent: '#4FD1AC',
                    light: '#3A8A73',
                },
                pumpkin: {
                    light: '#FFAC59',
                    orange: '#FF8C1A',
                    DEFAULT: '#FF8C1A',
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
