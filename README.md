# 🧠 ELI5 AI Simplifier

Transform complex topics into easy-to-understand explanations using the power of AI!

## ✅ **FULLY WORKING & READY TO USE!**

This project features a **Python FastAPI backend** with **Google Gemini AI** and a beautiful **Next.js frontend**!

---

## 🏗️ **Architecture**

```
ELI5/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # FastAPI application with Gemini AI
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # API keys and configuration
├── src/                       # Next.js Frontend
│   ├── components/            # React components
│   ├── pages/                 # Next.js pages
│   ├── lib/                   # Utilities
│   └── styles/                # Global styles
├── start-dev.ps1              # Development startup script
└── README.md                  # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Google Gemini API Key** - [Get free key](https://aistudio.google.com/app/apikey)

### **Setup in 4 Steps**

1. **Add your API key**
   ```powershell
   # Edit backend\.env and add your key:
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Run the startup script**
   ```powershell
   .\start-dev.ps1
   ```

3. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API Docs: `http://localhost:8000/docs`

4. **Start simplifying!** 🎉

---

## ⚡ **Manual Setup** (Alternative)

### **Backend (Terminal 1)**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

### **Frontend (Terminal 2)**
```powershell
npm install
npm run dev
```

---

## 🎯 **Key Features**

### **Backend (Python FastAPI)**
- ✅ **Google Gemini 2.5 Flash** - Latest AI model
- ✅ **Wikipedia Integration** - Auto context for better explanations
- ✅ **Text Cleaning** - Clean output without markdown
- ✅ **Auto Documentation** - Interactive docs at `/docs`

### **Frontend (Next.js + React)**
- ✅ **3 Complexity Levels** - Age 5, 15, Adult
- ✅ **Text-to-Speech** - Listen to explanations
- ✅ **Copy to Clipboard** - Easy sharing
- ✅ **Example Topics** - Quick start examples
- ✅ **Modern UI** - Beautiful Tailwind design

---

## 📚 **API Endpoints**

### **POST /api/simplify**
```json
{
  "text": "Explain quantum mechanics",
  "level": "ELI5",
  "use_wiki": true,
  "topic": "quantum"
}
```

### **GET /api/wiki/{topic}**
Get Wikipedia summary

### **GET /api/health**
Health check

---

## 🛠️ **Tech Stack**

**Backend:** FastAPI, Google GenAI, HTTPX, Pydantic  
**Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Hook Form

---

## 🎨 **Complexity Levels**

| Level | Target | Style |
|-------|--------|-------|
| **ELI5** 🧸 | Age 5 | Super simple |
| **ELI15** 🎓 | Age 15 | Teen-friendly |
| **Normal** 📚 | Adult | Full detail |

---

## 🐛 **Troubleshooting**

**"GEMINI_API_KEY required"**
- Check `backend\.env` has your API key

**"Network error"**
- Ensure backend runs on port 8000
- Visit `http://localhost:8000/api/health`

**Port in use**
- Backend: Stop processes on port 8000
- Frontend: Stop processes on port 3000

---

## 📦 **Deployment**

**Backend:** Heroku, Railway, Google Cloud Run  
**Frontend:** Vercel, Netlify

---

## 💡 **Usage Tips**

- Use Wikipedia topics for best results (e.g., "photosynthesis")
- Try all complexity levels to compare
- Text-to-speech works best on Chrome/Edge
- Reading time: ~200 words/minute

---

## 🎉 **You're Ready!**

Run `.\start-dev.ps1` and start making complex topics easy! 🚀
