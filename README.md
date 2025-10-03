# ELI5 AI - Transform Complex Ideas into Simple Explanations

🧠 **A modern, AI-powered text simplification platform** that transforms complex topics into crystal-clear explanations using Google's advanced Gemini AI.

![ELI5 AI](https://img.shields.io/badge/ELI5-AI%20Powered-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🎯 **Smart Complexity Levels**
- **ELI5** (Age 5): Simple explanations with basic vocabulary
- **ELI15** (Age 15): Intermediate explanations for teens  
- **Normal** (Adult): Comprehensive explanations with **real-time streaming**

### 🚀 **Modern Experience**
- **Real-time Streaming**: ChatGPT-like word-by-word response generation
- **Beautiful UI/UX**: Glass-morphism design with smooth animations
- **Wikipedia Integration**: Enhanced explanations with relevant context
- **Mobile Responsive**: Perfect on all devices
- **Copy to Clipboard**: Easy sharing of explanations
- **Example Prompts**: Quick start with predefined queries

### 💫 **Technical Excellence**
- **TypeScript**: Full type safety and better DX
- **Server-Sent Events**: Streaming responses without websockets
- **Modern API Design**: RESTful FastAPI backend
- **Production Ready**: Optimized for deployment

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development
- **Tailwind CSS** - Modern utility-first styling
- **React Hook Form + Zod** - Type-safe form validation
- **Lucide React** - Beautiful, customizable icons

### Backend  
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced language model
- **Server-Sent Events** - Real-time streaming responses
- **Pydantic** - Data validation and serialization
- **Uvicorn** - High-performance ASGI server

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ and pip  
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### 1. Clone & Setup
```bash
git clone <repository-url>
cd ELI5

# Copy environment template
cp .env.example .env.local
```

### 2. Environment Configuration
Add your API key to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
BACKEND_URL=http://localhost:8000
```

### 3. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies (in PowerShell)
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Start Development Servers

**Terminal 1 - Backend**
```powershell
cd backend
python main.py
# 🚀 Backend running at http://localhost:8000
```

**Terminal 2 - Frontend**  
```powershell
npm run dev
# 🚀 Frontend running at http://localhost:3000
```

### 5. Open Your Browser
- **App**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 📡 API Reference

### Backend Endpoints
```
POST   /api/simplify        # Standard text simplification
POST   /api/simplify-stream # Streaming text simplification  
GET    /api/health         # Health check
GET    /api/wiki/{topic}   # Wikipedia summary lookup
GET    /docs               # Interactive API documentation
```

### Frontend Routes
```
GET    /                   # Welcome homepage
GET    /simplify           # Simplification interface
POST   /api/simplify       # Proxy to backend
POST   /api/simplify-stream # Streaming proxy
```

## 💡 Usage Guide

### Basic Usage
1. 📝 **Enter your complex text** (scientific papers, technical docs, etc.)
2. 🎯 **Choose complexity level** (ELI5, ELI15, or Normal)
3. ⚡ **Get AI explanation** with real-time streaming for Normal level
4. 📋 **Copy and share** your simplified explanation

### Pro Tips
- **Complex Topics**: Works great with quantum physics, machine learning, blockchain
- **Academic Papers**: Paste abstracts or full sections for clear summaries
- **Technical Documentation**: Transform API docs into understandable guides
- **Streaming Mode**: Select "Normal" level for ChatGPT-like live responses

## 🏗 Project Structure

```
ELI5/
├── 🎨 src/
│   ├── components/         # React components
│   │   └── SimplificationForm.tsx
│   ├── pages/             # Next.js pages & API routes
│   │   ├── api/           # API proxy routes
│   │   ├── index.tsx      # Welcome homepage
│   │   └── simplify.tsx   # Main app interface
│   ├── lib/               # Utilities & helpers
│   └── styles/            # Global CSS & Tailwind
├── 🐍 backend/
│   ├── main.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
├── 📦 package.json        # Node.js configuration
└── 🎛 tailwind.config.js   # Styling configuration
```

## 🌍 Deployment

### Frontend (Vercel - Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel
npx vercel

# 3. Set environment variables in Vercel dashboard:
# GEMINI_API_KEY=your_key_here
# BACKEND_URL=your_backend_url
```

### Backend (Railway/Render)
```bash
# 1. Add Procfile to backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > backend/Procfile

# 2. Deploy backend service
# 3. Update BACKEND_URL in frontend environment
```

## 🔧 Development

### Adding New Features
- **Components**: Add to `src/components/`
- **API Routes**: Add to `src/pages/api/`
- **Backend Logic**: Extend `backend/main.py`
- **Styling**: Use Tailwind utilities or extend `globals.css`

### Code Quality
- ✅ **TypeScript** for type safety
- ✅ **ESLint** for code quality
- ✅ **Prettier** for consistent formatting
- ✅ **Responsive Design** mobile-first approach

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| ❌ API Key Error | Check `GEMINI_API_KEY` in `.env.local` |
| 🌐 CORS Issues | Restart backend server |
| 🔌 Connection Failed | Ensure both servers are running |
| 📦 Dependencies | Run `npm install` and `pip install -r requirements.txt` |

### Debug Commands
```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend build
npm run build

# View backend logs
cd backend && python main.py
```

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/amazing-feature`)
3. 📝 Make your changes
4. ✅ Test thoroughly
5. 📤 Submit pull request

### Development Workflow
```bash
# Start development
npm run dev          # Frontend
cd backend && python main.py  # Backend

# Code quality
npm run lint         # Check code
npm run build        # Test build
```

## 📄 License

**MIT License** - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- 🧠 **Google Gemini AI** - Powering intelligent text simplification
- ⚡ **Vercel** - Seamless frontend deployment
- 🎨 **Tailwind CSS** - Beautiful, responsive design system
- 🚀 **Next.js Team** - Amazing React framework
- 🐍 **FastAPI** - Modern, fast Python web framework

---

<div align="center">

**Made with ❤️ for better learning and understanding**

[⭐ Star this repo](https://github.com/your-username/eli5-ai) • [🐛 Report Bug](https://github.com/your-username/eli5-ai/issues) • [💡 Request Feature](https://github.com/your-username/eli5-ai/issues)

</div>