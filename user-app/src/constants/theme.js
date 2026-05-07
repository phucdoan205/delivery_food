export const COLORS = {
  primary: '#B23A00',
  primaryLight: '#FF7043',
  secondary: '#FBC02D',
  green: '#4CAF50',
  background: '#FFF8F5',
  white: '#FFFFFF',
  black: '#2D2D2D',
  gray: '#F5F5F5',
  lightGray: '#E0E0E0',
  text: '#2D2D2D',
  textLight: '#757575',
  border: '#EEEEEE',
  shadow: '#000000',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  radius: 12,
  radiusLarge: 24,
  radiusExtraLarge: 40,
  padding: 20,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
};
