import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './components/Header/Header';
import { HeroSection } from './components/HeroSection/HeroSection';
import { InputSection } from './components/InputSection/InputSection';
import { ResultsDisplay } from './components/ResultsDisplay/ResultsDisplay';
import { ExamplesSection } from './components/ExamplesSection/ExamplesSection';
import { Footer } from './components/Footer/Footer';

function App() {
  const [inputText, setInputText] = useState('');
  const [wikiTopic, setWikiTopic] = useState('');
  const [useWiki, setUseWiki] = useState(true);
  const [level, setLevel] = useState('ELI5');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExampleClick = (text: string, topic: string) => {
    setInputText(text);
    setWikiTopic(topic);
    setUseWiki(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box component="main" sx={{ flex: 1 }}>
        <HeroSection />
        
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            wikiTopic={wikiTopic}
            setWikiTopic={setWikiTopic}
            useWiki={useWiki}
            setUseWiki={setUseWiki}
            level={level}
            setLevel={setLevel}
            setResult={setResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          <ResultsDisplay result={result} isLoading={isLoading} />
          
          <ExamplesSection onExampleClick={handleExampleClick} />
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default App;