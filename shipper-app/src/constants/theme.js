export const COLORS = {
  primary: '#D35400', // Deep Orange/Rust
  secondary: '#A04000', // Darker Orange
  accent: '#E67E22', // Bright Orange
  success: '#2ECC71', // Green
  error: '#E74C3C', // Red
  warning: '#F1C40F', // Yellow
  info: '#3498DB', // Blue
  
  background: '#FDF5F2', // Light Cream
  card: '#FFFFFF',
  text: '#3E2723', // Dark Brown/Black
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  
  border: '#F2E6E1',
  white: '#FFFFFF',
  black: '#000000',
  
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, lineHeight: 36, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: SIZES.h2, lineHeight: 30, fontWeight: '700', color: COLORS.text },
  h3: { fontSize: SIZES.h3, lineHeight: 22, fontWeight: '700', color: COLORS.text },
  h4: { fontSize: SIZES.h4, lineHeight: 22, fontWeight: '700', color: COLORS.text },
  body1: { fontSize: SIZES.body1, lineHeight: 36, color: COLORS.text },
  body2: { fontSize: SIZES.body2, lineHeight: 30, color: COLORS.text },
  body3: { fontSize: SIZES.body3, lineHeight: 22, color: COLORS.text },
  body4: { fontSize: SIZES.body4, lineHeight: 22, color: COLORS.text },
};

const theme = { COLORS, SIZES, FONTS };

export default theme;
