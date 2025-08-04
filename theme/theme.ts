'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
// Base styles
import { Colors } from './base/colors';
import { Typography } from './base/typography';

// Theme constants
const THEME_COLORS = {
  background: {
    primary: '#373737',
    secondary: '#313131',
    dark: '#222222',
    black: '#000000',
    hover: '#414141',
  },
  text: {
    secondary: 'rgba(255, 255, 255, 0.6)',
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  accent: {
    primary: '#7DFFD1',
    selected: '#D7FFC4',
  },
} as const;

// Shared styles
const datePickerPopperStyles = {
  '& .MuiPickersDay-root': { color: 'black' },
  '& .MuiPickersDay-root.Mui-selected': {
    backgroundColor: THEME_COLORS.accent.selected,
  },
  '& .MuiPickersCalendarHeader-root': {
    color: 'black',
  },
  '& .MuiMultiSectionDigitalClock-root': {
    color: 'black',
  },
};

const datePickerInputStyles = {
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: THEME_COLORS.background.secondary,
    borderRadius: '10px',
  },
};

// Button responsive styles
const buttonResponsiveStyles = {
  '@media(min-width: 600px)': {
    ...Typography.buttonS,
  },
  '@media(min-width: 900px)': {
    ...Typography.buttonMSB,
  },
  '@media(min-width: 1200px)': {
    ...Typography.buttonLSB,
    padding: '8px 14px',
  },
  '@media(min-width: 1536px)': {
    ...Typography.buttonLSB,
    padding: '10px 14px',
  },
};

let theme = createTheme({
  palette: { ...Colors },
  breakpoints: {
    values: {
      xs: 390,
      sm: 540,
      md: 810,
      lg: 1200,
      xl: 1440,
    },
  },
  typography: { ...Typography },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: THEME_COLORS.background.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: 'inherit',
            opacity: 0.26,
          },
        },
        contained: {
          ...Typography.buttonX,
          backgroundColor: THEME_COLORS.background.primary,
          padding: '6px 10px',
          '&:hover': {
            backgroundColor: THEME_COLORS.background.hover,
          },
          ...buttonResponsiveStyles,
        },
        outlined: {
          ...Typography.buttonX,
          padding: '6px 10px',
          border: `1px solid ${THEME_COLORS.text.divider}`,
          backgroundColor: THEME_COLORS.background.black,
          '&:hover': {
            backgroundColor: THEME_COLORS.background.hover,
          },
          ...buttonResponsiveStyles,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: THEME_COLORS.text.secondary,
        },
        root: {
          borderRadius: '10px',
          backgroundColor: THEME_COLORS.background.secondary,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: THEME_COLORS.background.dark,
        },
        popupIndicator: {
          color: THEME_COLORS.text.secondary,
        },
        clearIndicator: {
          color: THEME_COLORS.text.secondary,
        },
        inputRoot: {
          borderRadius: '10px',
          backgroundColor: THEME_COLORS.background.secondary,
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiTimePicker: {
      defaultProps: {
        sx: datePickerInputStyles,
        slotProps: {
          popper: {
            sx: datePickerPopperStyles,
          },
        },
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        sx: datePickerInputStyles,
        slotProps: {
          popper: {
            sx: datePickerPopperStyles,
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: THEME_COLORS.background.dark,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: THEME_COLORS.accent.primary,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: THEME_COLORS.text.divider,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& > div > input': {
            padding: '8.5px 12px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: THEME_COLORS.accent.primary,
          textDecorationColor: THEME_COLORS.accent.primary,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
