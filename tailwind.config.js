/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
        "./src/**/*.component.html",
    ],
    darkMode: 'class', // 支援暗色主題
    theme: {
        extend: {
            // 加密貨幣交易所專用顏色
            colors: {
                // 主要品牌色
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                // 交易相關顏色
                trading: {
                    // 漲幅/買入
                    bull: {
                        50: '#f0fdf4',
                        100: '#dcfce7',
                        200: '#bbf7d0',
                        300: '#86efac',
                        400: '#4ade80',
                        500: '#22c55e',
                        600: '#16a34a',
                        700: '#15803d',
                        800: '#166534',
                        900: '#14532d',
                    },
                    // 跌幅/賣出
                    bear: {
                        50: '#fef2f2',
                        100: '#fee2e2',
                        200: '#fecaca',
                        300: '#fca5a5',
                        400: '#f87171',
                        500: '#ef4444',
                        600: '#dc2626',
                        700: '#b91c1c',
                        800: '#991b1b',
                        900: '#7f1d1d',
                    },
                    // 中性
                    neutral: {
                        50: '#f8fafc',
                        100: '#f1f5f9',
                        200: '#e2e8f0',
                        300: '#cbd5e1',
                        400: '#94a3b8',
                        500: '#64748b',
                        600: '#475569',
                        700: '#334155',
                        800: '#1e293b',
                        900: '#0f172a',
                    }
                },
                // 加密貨幣品牌色
                crypto: {
                    bitcoin: '#f7931a',
                    ethereum: '#627eea',
                    gold: '#f59e0b',
                    silver: '#6b7280',
                },
                // 圖表顏色
                chart: {
                    blue: '#3b82f6',
                    green: '#22c55e',
                    red: '#ef4444',
                    yellow: '#f59e0b',
                    purple: '#8b5cf6',
                    orange: '#f97316',
                    teal: '#14b8a6',
                    pink: '#ec4899',
                }
            },
            // 字體家族
            fontFamily: {
                'sans': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                'mono': ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
                'display': ['Inter', 'system-ui', 'sans-serif'],
            },
            // 字體大小（擴展）
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
            },
            // 陰影（擴展）
            boxShadow: {
                'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.15)',
            },
            // 動畫
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'slide-down': 'slideDown 0.8s ease-out',
                'slide-left': 'slideLeft 0.8s ease-out',
                'slide-right': 'slideRight 0.8s ease-out',
                'scale-in': 'scaleIn 0.4s ease-out',
                'bounce-gentle': 'bounceGentle 2s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'crypto-pulse': 'cryptoPulse 2s ease-in-out infinite',
            },
            // 關鍵幀動畫
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideLeft: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' },
                    '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(10deg)' },
                },
                cryptoPulse: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
                },
            },
            // 背景漸變
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #3b82f6, #2563eb)',
                'gradient-trading-bull': 'linear-gradient(135deg, #22c55e, #16a34a)',
                'gradient-trading-bear': 'linear-gradient(135deg, #ef4444, #dc2626)',
                'gradient-crypto': 'linear-gradient(135deg, #3b82f6, #8b5cf6, #22c55e)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            // 模糊效果
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
                '3xl': '40px',
            },
            // 間距擴展
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
                '144': '36rem',
            },
            // 斷點擴展
            screens: {
                'xs': '475px',
                '3xl': '1600px',
            },
            // 過渡時間
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '1200': '1200ms',
            },
            // Z-index
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            }
        },
    },
    plugins: [
        // 表單樣式插件
        require('@tailwindcss/forms'),
        // 自定義插件
        function({ addUtilities, addComponents, theme }) {
            // 自定義工具類別
            addUtilities({
                '.gradient-text': {
                    'background': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                '.glass': {
                    'background': 'rgba(255, 255, 255, 0.1)',
                    'backdrop-filter': 'blur(10px)',
                    '-webkit-backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.2)',
                },
                '.price-up': {
                    'color': theme('colors.trading.bull.500'),
                },
                '.price-down': {
                    'color': theme('colors.trading.bear.500'),
                },
                '.price-neutral': {
                    'color': theme('colors.trading.neutral.500'),
                },
            });

            // 自定義元件
            addComponents({
                '.btn-crypto': {
                    'padding': theme('spacing.3') + ' ' + theme('spacing.6'),
                    'border-radius': theme('borderRadius.lg'),
                    'font-weight': theme('fontWeight.semibold'),
                    'transition': 'all 200ms',
                    'background': 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    'color': theme('colors.white'),
                    'box-shadow': '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
                    '&:hover': {
                        'background': 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        'transform': 'translateY(-1px)',
                        'box-shadow': '0 6px 20px 0 rgba(59, 130, 246, 0.35)',
                    },
                },
                '.card-trading': {
                    'background': theme('colors.white'),
                    'border-radius': theme('borderRadius.xl'),
                    'box-shadow': theme('boxShadow.lg'),
                    'border': '1px solid ' + theme('colors.gray.200'),
                    'padding': theme('spacing.6'),
                    'transition': 'all 300ms',
                    '&:hover': {
                        'box-shadow': theme('boxShadow.xl'),
                        'transform': 'translateY(-2px)',
                        'border-color': theme('colors.gray.300'),
                    },
                },
            });
        }
    ],
}

