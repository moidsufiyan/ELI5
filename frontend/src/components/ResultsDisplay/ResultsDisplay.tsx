import {
  Box,
  Card,
  CardContent,
  Typography,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';
import { useState } from 'react';

interface ResultsDisplayProps {
  result: string;
  isLoading: boolean;
}

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!result && !isLoading) {
    return null;
  }

  return (
    <Fade in={!!result || isLoading}>
      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Simplified Explanation
            </Typography>
            
            {result && (
              <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                <IconButton onClick={handleCopy} size="small">
                  {copied ? <CheckCircle color="success" /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      opacity: 0.7,
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  },
                }}
              />
              <Typography color="text.secondary">
                AI is processing your request...
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.primary',
                whiteSpace: 'pre-wrap',
              }}
            >
              {result}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
}
