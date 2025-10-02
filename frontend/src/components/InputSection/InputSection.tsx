import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send, Clear } from '@mui/icons-material';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  wikiTopic: string;
  setWikiTopic: (topic: string) => void;
  useWiki: boolean;
  setUseWiki: (use: boolean) => void;
  level: string;
  setLevel: (level: string) => void;
  setResult: (result: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function InputSection({
  inputText,
  setInputText,
  wikiTopic,
  setWikiTopic,
  useWiki,
  setUseWiki,
  level,
  setLevel,
  setResult,
  isLoading,
  setIsLoading,
}: InputSectionProps) {
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    
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
      setResult(data.simplified_text);
    } catch (err) {
      setError('Failed to simplify text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setWikiTopic('');
    setResult('');
    setError('');
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Enter Text to Simplify
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Text to simplify"
            placeholder="Enter complex text, concepts, or topics you want explained..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            inputProps={{ maxLength: 5000 }}
            helperText={`${inputText.length}/5000 characters`}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Complexity Level</InputLabel>
              <Select
                value={level}
                label="Complexity Level"
                onChange={(e) => setLevel(e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="ELI5">ELI5 (Age 5)</MenuItem>
                <MenuItem value="ELI15">ELI15 (Age 15)</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={useWiki}
                  onChange={(e) => setUseWiki(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Use Wikipedia context"
            />
          </Box>

          {useWiki && (
            <TextField
              fullWidth
              label="Wikipedia topic (optional)"
              placeholder="e.g., quantum physics, machine learning..."
              value={wikiTopic}
              onChange={(e) => setWikiTopic(e.target.value)}
              disabled={isLoading}
              helperText="Provide a Wikipedia topic for more accurate context"
            />
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={isLoading || (!inputText && !wikiTopic)}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              onClick={handleSubmit}
              disabled={isLoading || !inputText.trim()}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? 'Processing...' : 'Simplify'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
