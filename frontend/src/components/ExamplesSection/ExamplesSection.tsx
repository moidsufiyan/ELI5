import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import { Science, Computer, Psychology, Biotech } from '@mui/icons-material';
interface ExamplesSectionProps {
  onExampleClick: (text: string, topic: string) => void;
}

const examples = [
  {
    id: '1',
    title: 'Quantum Physics',
    text: 'Explain quantum entanglement and how particles can be connected across vast distances',
    topic: 'quantum entanglement',
    level: 'ELI5',
  },
  {
    id: '2',
    title: 'Machine Learning',
    text: 'How do neural networks learn and make predictions from data?',
    topic: 'neural network',
    level: 'ELI15',
  },
  {
    id: '3',
    title: 'DNA & Genetics',
    text: 'What is DNA and how does it determine our characteristics and traits?',
    topic: 'DNA',
    level: 'ELI5',
  },
  {
    id: '4',
    title: 'Blockchain Technology',
    text: 'How does blockchain work and why is it considered secure and decentralized?',
    topic: 'blockchain',
    level: 'Normal',
  },
];

const getIcon = (title: string) => {
  if (title.includes('Quantum')) return <Science />;
  if (title.includes('Machine')) return <Computer />;
  if (title.includes('DNA')) return <Biotech />;
  return <Psychology />;
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'ELI5': return 'success';
    case 'ELI15': return 'warning';
    case 'Normal': return 'info';
    default: return 'default';
  }
};

export function ExamplesSection({ onExampleClick }: ExamplesSectionProps) {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
        Try These Examples
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {examples.map((example) => (
          <Card 
            key={example.id}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              },
            }}
          >
            <CardActionArea
              onClick={() => onExampleClick(example.text, example.topic)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {getIcon(example.title)}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    {example.title}
                  </Typography>
                  <Chip
                    label={example.level}
                    size="small"
                    color={getLevelColor(example.level) as any}
                    variant="outlined"
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, mb: 2 }}
                >
                  {example.text}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Wikipedia topic: <strong>{example.topic}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
