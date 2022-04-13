import Box from '@mui/material/Box/Box';

export const StackMui: React.FC<{
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  style?: React.CSSProperties;
}> = ({ direction = 'row', style, children }) => (
  <Box
    sx={{
      display: 'flex',
      '& > *': {
        m: 1
      },
      flexDirection: direction,
      ...style
    }}
  >
    {children}
  </Box>
);
