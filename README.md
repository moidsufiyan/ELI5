# 🧠 ELI5 AI Simplifier

A simple AI-powered text simplifier that makes complex topics easy to understand. Built with React and FastAPI using Google's Gemini AI.

## ✨ Features

- **🤖 AI-Powered**: Uses Google's Gemini AI to simplify complex text
- **📚 Wikipedia Integration**: Gets context from Wikipedia for better explanations
- **🎯 Multiple Levels**: Choose ELI5, ELI15, or Normal complexity
- **🎨 Clean UI**: Simple and easy to use interface

## 🚀 Quick Start

### What You Need

- Node.js 18+ and npm
- Python 3.11+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Setup

1. **Get the code**
   ```bash
   git clone https://github.com/yourusername/eli5-simplifier.git
   cd eli5-simplifier
   ```

2. **Set up your API key**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Install stuff**
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   cd ..
   ```

4. **Run it**
   ```bash
   # Start backend (Terminal 1)
   python app.py
   
   # Start frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Use it**
   - Open http://localhost:5173 in your browser
   - Backend runs on http://localhost:8000

## 📁 What's Inside

```
eli5-simplifier/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── App.tsx       # Main app
│   │   └── main.tsx      # Entry point
│   └── package.json      # Frontend dependencies
├── app.py                # FastAPI backend
├── requirements.txt      # Python dependencies
├── .env.example         # Environment template
└── README.md           # This file
```

## 🚀 Deploy to GitHub

1. **Create a new repository on GitHub**
2. **Push your code**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/eli5-simplifier.git
   git push -u origin main
   ```

## 🌐 Deploy Online

**Vercel (Easy):**
1. Connect your GitHub repo to Vercel
2. Add `GEMINI_API_KEY` in Vercel environment variables
3. Deploy!

**Other platforms:** Railway, Render, or Heroku work too.

---

Made with ❤️ to make complex stuff simple!