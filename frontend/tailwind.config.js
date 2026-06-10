/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Legacy cs-* tokens (CSS-var based, auto dark mode) ── */
        cs: {
          bg:              'var(--bg)',
          sidebar:         'var(--sidebar)',
          surface:         'var(--surface)',
          'surface-lo':    'var(--surface-lo)',
          'surface-hi':    'var(--surface-hi)',
          'on-surface':    'var(--on-surface)',
          'on-sv':         'var(--on-sv)',
          muted:           'var(--muted)',
          border:          'var(--border)',
          'border-lo':     'var(--border-lo)',
          primary:         'var(--primary)',
          'primary-hover': 'var(--primary-hover)',
          'primary-tint':  'var(--primary-tint)',
          'primary-fixed': 'var(--primary-fixed)',
          'primary-dim':   'var(--primary-dim)',
          'primary-light': 'var(--primary-light)',
          error:           'var(--error)',
          success:         'var(--success)',
          warning:         'var(--warning)',
        },

        /* ══ Stitch / MD3 tokens — CSS variable based (auto dark mode) ══
           Using rgb(var(--m3-xxx) / <alpha-value>) so opacity modifiers
           like bg-primary/20 and text-primary/60 work correctly.        */

        /* Backgrounds */
        background:                   'rgb(var(--m3-background) / <alpha-value>)',
        'on-background':              'rgb(var(--m3-on-background) / <alpha-value>)',

        /* Surface containers */
        'surface-container-lowest':   'rgb(var(--m3-surface-container-lowest) / <alpha-value>)',
        'surface-container-low':      'rgb(var(--m3-surface-container-low) / <alpha-value>)',
        'surface-container':          'rgb(var(--m3-surface-container) / <alpha-value>)',
        'surface-container-high':     'rgb(var(--m3-surface-container-high) / <alpha-value>)',
        'surface-container-highest':  'rgb(var(--m3-surface-container-highest) / <alpha-value>)',
        'surface-variant':            'rgb(var(--m3-surface-variant) / <alpha-value>)',
        'surface-dim':                'rgb(var(--m3-surface-dim) / <alpha-value>)',
        'surface-bright':             'rgb(var(--m3-surface-bright) / <alpha-value>)',
        'on-surface':                 'rgb(var(--m3-on-surface) / <alpha-value>)',
        'on-surface-variant':         'rgb(var(--m3-on-surface-variant) / <alpha-value>)',
        'inverse-surface':            'rgb(var(--m3-inverse-surface) / <alpha-value>)',
        'inverse-on-surface':         'rgb(var(--m3-inverse-on-surface) / <alpha-value>)',

        /* Outlines */
        outline:                      'rgb(var(--m3-outline) / <alpha-value>)',
        'outline-variant':            'rgb(var(--m3-outline-variant) / <alpha-value>)',

        /* Primary */
        primary:                      'rgb(var(--m3-primary) / <alpha-value>)',
        'primary-container':          'rgb(var(--m3-primary-container) / <alpha-value>)',
        'on-primary':                 'rgb(var(--m3-on-primary) / <alpha-value>)',
        'on-primary-container':       'rgb(var(--m3-on-primary-container) / <alpha-value>)',
        'primary-fixed':              'rgb(var(--m3-primary-fixed) / <alpha-value>)',
        'primary-fixed-dim':          'rgb(var(--m3-primary-fixed-dim) / <alpha-value>)',
        'inverse-primary':            'rgb(var(--m3-inverse-primary) / <alpha-value>)',
        'on-primary-fixed':           'rgb(var(--m3-on-primary-fixed) / <alpha-value>)',
        'on-primary-fixed-variant':   'rgb(var(--m3-on-primary-fixed-variant) / <alpha-value>)',

        /* Secondary */
        secondary:                    'rgb(var(--m3-secondary) / <alpha-value>)',
        'secondary-container':        'rgb(var(--m3-secondary-container) / <alpha-value>)',
        'on-secondary':               'rgb(var(--m3-on-secondary) / <alpha-value>)',
        'on-secondary-container':     'rgb(var(--m3-on-secondary-container) / <alpha-value>)',
        'secondary-fixed':            'rgb(var(--m3-secondary-fixed) / <alpha-value>)',
        'secondary-fixed-dim':        'rgb(var(--m3-secondary-fixed-dim) / <alpha-value>)',
        'on-secondary-fixed':         'rgb(var(--m3-on-secondary-fixed) / <alpha-value>)',
        'on-secondary-fixed-variant': 'rgb(var(--m3-on-secondary-fixed-variant) / <alpha-value>)',

        /* Tertiary */
        tertiary:                     'rgb(var(--m3-tertiary) / <alpha-value>)',
        'tertiary-container':         'rgb(var(--m3-tertiary-container) / <alpha-value>)',
        'on-tertiary':                'rgb(var(--m3-on-tertiary) / <alpha-value>)',
        'on-tertiary-container':      'rgb(var(--m3-on-tertiary-container) / <alpha-value>)',
        'tertiary-fixed':             'rgb(var(--m3-tertiary-fixed) / <alpha-value>)',
        'tertiary-fixed-dim':         'rgb(var(--m3-tertiary-fixed-dim) / <alpha-value>)',
        'on-tertiary-fixed':          'rgb(var(--m3-on-tertiary-fixed) / <alpha-value>)',
        'on-tertiary-fixed-variant':  'rgb(var(--m3-on-tertiary-fixed-variant) / <alpha-value>)',

        /* Error */
        error:                        'rgb(var(--m3-error) / <alpha-value>)',
        'error-container':            'rgb(var(--m3-error-container) / <alpha-value>)',
        'on-error':                   'rgb(var(--m3-on-error) / <alpha-value>)',
        'on-error-container':         'rgb(var(--m3-on-error-container) / <alpha-value>)',

        /* Static accent colors */
        cyan:   '#7CB9C8',
        violet: '#A78BCF',
        rose:   '#D98C9A',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        display:        ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1:             ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        h2:             ['24px', { lineHeight: '1.3',  fontWeight: '700' }],
        'body-lg':      ['16px', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-md':      ['14px', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-md-bold': ['14px', { lineHeight: '1.5',  fontWeight: '500' }],
        'label-caps':   ['10px', { lineHeight: '1rem', letterSpacing: '0.05em', fontWeight: '600' }],
        'h1-mobile':    ['28px', { lineHeight: '1.2',  fontWeight: '700' }],
      },

      borderRadius: {
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
        card:   '16px',
        btn:    '12px',
        input:  '8px',
      },

      boxShadow: {
        card:           '0 4px 20px rgba(0,0,0,0.04)',
        'card-hover':   '0 8px 30px rgba(0,0,0,0.08)',
        soft:           '0 4px 20px rgba(0,0,0,0.05)',
        hover:          '0 8px 30px rgba(0,0,0,0.08)',
        burgundy:       '0 8px 30px rgba(108,22,39,0.08)',
        'burgundy-glow':'0 0 15px rgba(108,22,39,0.3)',
        'up':           '0 -4px 20px rgba(0,0,0,0.06)',
      },

      spacing: {
        'sidebar-width': '240px',
      },

      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)'    },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'    },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.5)' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)'   },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)'   },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
      },

      animation: {
        'fade-in-up':  'fadeInUp 0.4s ease-out both',
        'fade-in':     'fadeIn 0.3s ease-out both',
        'scale-in':    'scaleIn 0.25s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'slide-right': 'slideInRight 0.3s ease-out both',
        'bounce-in':   'bounceIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'float':       'float 4s ease-in-out infinite',
        'float-slow':  'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
