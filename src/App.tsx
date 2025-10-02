import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
    },
    secondary: {
      main: '#8B5CF6',
    },
  },
});

type SimplifyLevel = 'ELI5' | 'ELI15' | 'Normal';

interface SimplifyResponse {
  simplified_text: string;
  used_wiki: boolean;
  wiki_title?: string;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [wikiTopic, setWikiTopic] = useState('');
  const [useWiki, setUseWiki] = useState(true);
  const [level, setLevel] = useState<SimplifyLevel>('ELI5');
  const [result, setResult] = useState<SimplifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to simplify!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          level,
          use_wiki: useWiki,
          topic: wikiTopic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to simplify text');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setWikiTopic('');
    setResult(null);
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            🧠 ELI5 AI Simplifier
          </Typography>
          
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Make complex topics simple and easy to understand
          </Typography>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  What would you like to understand?
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter a complex topic or question... (e.g., 'Explain quantum physics' or 'How does photosynthesis work?')"
                  variant="outlined"
                />
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useWiki}
                      onChange={(e) => setUseWiki(e.target.checked)}
                    />
                  }
                  label="Use Wikipedia context"
                />
                
                <TextField
                  fullWidth
                  value={wikiTopic}
                  onChange={(e) => setWikiTopic(e.target.value)}
                  placeholder="Wikipedia topic (optional)"
                  variant="outlined"
                  size="small"
                  disabled={!useWiki}
                />
              </Stack>

              <FormControl fullWidth>
                <InputLabel>Explanation Level</InputLabel>
                <Select
                  value={level}
                  label="Explanation Level"
                  onChange={(e) => setLevel(e.target.value as SimplifyLevel)}
                >
                  <MenuItem value="ELI5">ELI5 (5-year-old)</MenuItem>
                  <MenuItem value="ELI15">ELI15 (15-year-old)</MenuItem>
                  <MenuItem value="Normal">Normal (Adult)</MenuItem>
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleSimplify}
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? <CircularProgress size={24} /> : 'Simplify with AI'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleClear}
                  sx={{ minWidth: { xs: '100%', sm: '140px' } }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Simplified Explanation:
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                {result.simplified_text}
              </Typography>
              {result.used_wiki && result.wiki_title && (
                <Typography variant="caption" color="text.secondary">
                  Enhanced with Wikipedia context from: {result.wiki_title}
                </Typography>
              )}
            </Paper>
          )}

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ to make learning accessible to everyone
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
