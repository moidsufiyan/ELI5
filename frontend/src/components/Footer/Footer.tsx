import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { Favorite, GitHub, LinkedIn } from '@mui/icons-material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Made with <Favorite sx={{ color: 'red', fontSize: 16, mx: 0.5 }} /> to make learning accessible to everyone
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
            >
              <GitHub fontSize="small" />
              GitHub
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
            >
              <LinkedIn fontSize="small" />
              LinkedIn
            </Link>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} ELI5 AI Simplifier. Powered by Google Gemini AI & Wikipedia.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
