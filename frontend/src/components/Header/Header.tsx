import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Psychology } from '@mui/icons-material';

export function Header() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology sx={{ fontSize: 32 }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            ELI5 AI Simplifier
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
