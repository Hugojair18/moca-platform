export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#F5F7FA', // Soft gray/blue background
                    100: '#E4E9F2',
                    200: '#CCD7E8',
                    300: '#A6C0DD',
                    400: '#6FA4D1',
                    500: '#1E88E5', // Primary Blue (Trust)
                    600: '#1565C0',
                    700: '#0D47A1',
                    800: '#0A3575',
                    900: '#05214A',
                },
                slate: {
                    50: '#F8FAFC',
                    800: '#1E293B',
                    900: '#0F172A',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
