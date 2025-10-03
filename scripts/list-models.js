const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No GEMINI_API_KEY found in environment variables');
    console.log('💡 Add your API key to .env.local file or run:');
    console.log('   $env:GEMINI_API_KEY="your_key_here"; node scripts/list-models.js');
    return;
  }

  console.log('🔍 Checking available Gemini models...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('✅ Available models:');
    models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      if (model.description) {
        console.log(`   Description: ${model.description}`);
      }
      console.log(`   Supports: ${model.supportedGenerationMethods?.join(', ') || 'Unknown'}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    
    // If listing fails, try common model names
    console.log('\n🔧 Testing common model names...\n');
    
    const commonModels = [
      'gemini-pro',
      'gemini-1.5-pro', 
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of commonModels) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response.text();
        console.log(`✅ ${modelName} - WORKS`);
        console.log(`   Response: ${response.substring(0, 50)}...\n`);
      } catch (testError) {
        console.log(`❌ ${modelName} - FAILED: ${testError.message}\n`);
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  listModels().catch(console.error);
}

module.exports = { listModels };