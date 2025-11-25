'use client';

import Box from '@mui/material/Box';
import Navigation from '../../components/navigation';

export default function Layout({ children }) {
  return (
    <Box className="content">
      <Navigation />
      {children}
    </Box>
  );
}
