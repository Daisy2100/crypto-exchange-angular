/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
        "./src/**/*.component.html",
    ],
    darkMode: 'class', // 支援暗色主題
    theme: {
        extend: {
            // 賽博龐克主色調
            colors: {
                // 暗色背景
                'cyber': {
                    50: '#0a0a0a',
                    100: '#111111',
                    200: '#1a1a1a',
                    300: '#222222',
                    400: '#2a2a2a',
                    500: '#333333',
                    600: '#444444',
                    700: '#555555',
                    800: '#666666',
                    900: '#777777',
                },
                // 霓虹色系
                'neon': {
                    'cyan': '#00ffff',
                    'pink': '#ff00ff',
                    'green': '#00ff00',
                    'blue': '#0099ff',
                    'purple': '#9933ff',
                    'orange': '#ff6600',
                    'yellow': '#ffff00',
                    'red': '#ff0066',
                },
                // 主要品牌色（保留但改為霓虹風格）
                primary: {
                    50: '#001133',
                    100: '#002266',
                    200: '#003399',
                    300: '#0044cc',
                    400: '#0066ff',
                    500: '#0099ff',
                    600: '#33aaff',
                    700: '#66bbff',
                    800: '#99ccff',
                    900: '#ccddff',
                },
                // 交易相關顏色（霓虹風格）
                trading: {
                    // 漲幅/買入（霓虹綠）
                    bull: {
                        50: '#001100',
                        100: '#002200',
                        200: '#003300',
                        300: '#004400',
                        400: '#006600',
                        500: '#00ff00',
                        600: '#33ff33',
                        700: '#66ff66',
                        800: '#99ff99',
                        900: '#ccffcc',
                    },
                    // 跌幅/賣出（霓虹紅）
                    bear: {
                        50: '#220011',
                        100: '#440022',
                        200: '#660033',
                        300: '#880044',
                        400: '#aa0055',
                        500: '#ff0066',
                        600: '#ff3388',
                        700: '#ff66aa',
                        800: '#ff99cc',
                        900: '#ffccee',
                    },
                    // 中性（霓虹藍）
                    neutral: {
                        50: '#001122',
                        100: '#002244',
                        200: '#003366',
                        300: '#004488',
                        400: '#0055aa',
                        500: '#0099ff',
                        600: '#33aaff',
                        700: '#66bbff',
                        800: '#99ccff',
                        900: '#ccddff',
                    }
                },
                // 加密貨幣品牌色（霓虹化）
                crypto: {
                    bitcoin: '#ffaa00',
                    ethereum: '#6600ff',
                    gold: '#ffcc00',
                    silver: '#aaaaaa',
                },
            },
            // 字體家族（賽博龐克風格）
            fontFamily: {
                'cyber': ['Orbitron', 'Roboto Mono', 'monospace'],
                'mono': ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
                'sans': ['Roboto', 'system-ui', 'sans-serif'],
                'display': ['Orbitron', 'system-ui', 'sans-serif'],
            },
            // 陰影（霓虹光暈效果）
            boxShadow: {
                'neon-cyan': '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
                'neon-pink': '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
                'neon-green': '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00',
                'neon-blue': '0 0 20px #0099ff, 0 0 40px #0099ff, 0 0 60px #0099ff',
                'neon-purple': '0 0 20px #9933ff, 0 0 40px #9933ff, 0 0 60px #9933ff',
                'neon-orange': '0 0 20px #ff6600, 0 0 40px #ff6600, 0 0 60px #ff6600',
                'neon-red': '0 0 20px #ff0066, 0 0 40px #ff0066, 0 0 60px #ff0066',
                'cyber-inset': 'inset 0 1px 3px rgba(0, 255, 255, 0.2)',
                'cyber-border': '0 0 0 1px rgba(0, 255, 255, 0.3)',
            },
            // 動畫
            animation: {
                'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
                'glitch': 'glitch 0.3s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.8s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
                'scan-line': 'scanLine 2s linear infinite',
                'data-stream': 'dataStream 3s linear infinite',
                'hologram': 'hologram 4s ease-in-out infinite',
                'cyber-typing': 'cyberTyping 3s steps(40) infinite',
                'matrix-rain': 'matrixRain 20s linear infinite',
                'circuit-flow': 'circuitFlow 8s ease-in-out infinite',
            },
            // 關鍵幀動畫
            keyframes: {
                neonPulse: {
                    '0%': {
                        textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
                        boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
                    },
                    '100%': {
                        textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
                        boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
                    },
                },
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scanLine: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                dataStream: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100vw)' },
                },
                hologram: {
                    '0%, 100%': { opacity: '1', filter: 'hue-rotate(0deg)' },
                    '50%': { opacity: '0.8', filter: 'hue-rotate(90deg)' },
                },
                cyberTyping: {
                    '0%': { width: '0' },
                    '50%': { width: '100%' },
                    '100%': { width: '0' },
                },
                matrixRain: {
                    '0%': { transform: 'translateY(-100vh)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                circuitFlow: {
                    '0%, 100%': { strokeDashoffset: '0' },
                    '50%': { strokeDashoffset: '100' },
                },
            },
            // 背景圖案
            backgroundImage: {
                'cyber-grid': `
                    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                `,
                'neon-gradient': 'linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #0099ff)',
                'cyber-circuit': `
                    radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 2px, transparent 2px)
                `,
                'matrix-code': `
                    repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(0, 255, 0, 0.05) 2px,
                        rgba(0, 255, 0, 0.05) 4px
                    )
                `,
                'glitch-lines': `
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 0, 102, 0.1) 2px,
                        rgba(255, 0, 102, 0.1) 4px
                    )
                `,
            },
            // 背景尺寸
            backgroundSize: {
                'grid': '50px 50px',
                'circuit': '100px 100px',
                'matrix': '20px 20px',
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
        },
    },
    plugins: [
        // 自定義插件
        function({ addUtilities, addComponents, theme }) {
            // 自定義工具類別
            addUtilities({
                '.gradient-text-cyber': {
                    'background': 'linear-gradient(45deg, #00ffff, #ff00ff, #00ff00)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                    'background-size': '200% 200%',
                    'animation': 'gradientShift 3s ease-in-out infinite',
                },
                '.text-shadow-neon': {
                    'text-shadow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
                },
                '.text-shadow-cyber': {
                    'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px currentColor',
                },
                '.glass-cyber': {
                    'background': 'rgba(0, 0, 0, 0.7)',
                    'backdrop-filter': 'blur(10px)',
                    '-webkit-backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(0, 255, 255, 0.3)',
                    'box-shadow': '0 0 20px rgba(0, 255, 255, 0.1)',
                },
                '.hologram-effect': {
                    'background': 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
                    'background-size': '200% 200%',
                    'animation': 'hologram 4s ease-in-out infinite',
                },
                '.scan-lines': {
                    'background': `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0, 255, 255, 0.03) 2px,
                        rgba(0, 255, 255, 0.03) 4px
                    )`,
                },
                '.price-up-cyber': {
                    'color': theme('colors.neon.green'),
                    'text-shadow': '0 0 10px currentColor',
                },
                '.price-down-cyber': {
                    'color': theme('colors.neon.red'),
                    'text-shadow': '0 0 10px currentColor',
                },
                '.price-neutral-cyber': {
                    'color': theme('colors.neon.blue'),
                    'text-shadow': '0 0 10px currentColor',
                },
            });

            // 自定義元件
            addComponents({
                '.btn-cyber': {
                    'padding': theme('spacing.3') + ' ' + theme('spacing.6'),
                    'border-radius': theme('borderRadius.lg'),
                    'font-weight': theme('fontWeight.semibold'),
                    'font-family': theme('fontFamily.cyber'),
                    'transition': 'all 300ms',
                    'background': 'linear-gradient(45deg, rgba(0, 255, 255, 0.8), rgba(0, 153, 255, 0.8))',
                    'color': theme('colors.cyber.50'),
                    'border': '1px solid ' + theme('colors.neon.cyan'),
                    'box-shadow': '0 0 20px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    'text-shadow': '0 0 10px currentColor',
                    'text-transform': 'uppercase',
                    'letter-spacing': '0.05em',
                    '&:hover': {
                        'background': 'linear-gradient(45deg, rgba(0, 255, 255, 1), rgba(0, 153, 255, 1))',
                        'transform': 'translateY(-2px)',
                        'box-shadow': '0 0 30px rgba(0, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        'text-shadow': '0 0 15px currentColor',
                    },
                    '&:active': {
                        'transform': 'translateY(0)',
                        'box-shadow': '0 0 15px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    },
                },
                '.btn-cyber-secondary': {
                    'padding': theme('spacing.3') + ' ' + theme('spacing.6'),
                    'border-radius': theme('borderRadius.lg'),
                    'font-weight': theme('fontWeight.semibold'),
                    'font-family': theme('fontFamily.cyber'),
                    'transition': 'all 300ms',
                    'background': 'rgba(0, 0, 0, 0.8)',
                    'color': theme('colors.neon.cyan'),
                    'border': '1px solid ' + theme('colors.neon.cyan'),
                    'box-shadow': '0 0 15px rgba(0, 255, 255, 0.2)',
                    'text-shadow': '0 0 8px currentColor',
                    'text-transform': 'uppercase',
                    'letter-spacing': '0.05em',
                    '&:hover': {
                        'background': 'rgba(0, 255, 255, 0.1)',
                        'transform': 'translateY(-2px)',
                        'box-shadow': '0 0 25px rgba(0, 255, 255, 0.4)',
                        'text-shadow': '0 0 12px currentColor',
                    },
                },
                '.card-cyber': {
                    'background': 'rgba(0, 0, 0, 0.9)',
                    'border-radius': theme('borderRadius.xl'),
                    'border': '1px solid rgba(0, 255, 255, 0.3)',
                    'box-shadow': '0 0 20px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(0, 255, 255, 0.1)',
                    'padding': theme('spacing.6'),
                    'transition': 'all 300ms',
                    'backdrop-filter': 'blur(10px)',
                    'position': 'relative',
                    '&:hover': {
                        'border-color': 'rgba(0, 255, 255, 0.5)',
                        'box-shadow': '0 0 30px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(0, 255, 255, 0.2)',
                        'transform': 'translateY(-4px)',
                    },
                    '&::before': {
                        'content': '""',
                        'position': 'absolute',
                        'top': '0',
                        'left': '0',
                        'right': '0',
                        'bottom': '0',
                        'background': 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.05) 50%, transparent 70%)',
                        'background-size': '200% 200%',
                        'animation': 'hologram 8s ease-in-out infinite',
                        'border-radius': 'inherit',
                        'pointer-events': 'none',
                    },
                },
            });
        }
    ],
}
