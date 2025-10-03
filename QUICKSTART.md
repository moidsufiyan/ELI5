# ⚡ ELI5 AI Simplifier - Quick Start Guide

## 🎯 **Before You Start**

You need:
1. Your **Google Gemini API Key** from https://aistudio.google.com/app/apikey
2. **Python 3.8+** and **Node.js 18+** installed

---

## 🚀 **3-Step Setup**

### **1. Add Your API Key**

Open `backend\.env` and replace with your actual key:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **2. Run the Startup Script**

```powershell
.\start-dev.ps1
```

This script will:
- ✅ Check Python and Node.js
- ✅ Create Python virtual environment
- ✅ Install all dependencies (Python + Node.js)
- ✅ Start backend on port 8000
- ✅ Start frontend on port 3000

### **3. Open Your Browser**

Visit **http://localhost:3000** and start simplifying!

---

## 🎉 **That's It!**

Your ELI5 AI Simplifier is ready to use!

### **What You Can Do:**

- Enter any complex text
- Choose complexity level (Age 5, 15, or Adult)
- Get AI-powered simple explanations
- Listen with text-to-speech
- Copy and share

---

## 🔧 **If Something Goes Wrong**

### **"GEMINI_API_KEY required"**
→ Make sure `backend\.env` has your real API key

### **Backend won't start**
→ Check if port 8000 is free: `netstat -ano | findstr :8000`

### **Frontend won't start**
→ Check if port 3000 is free: `netstat -ano | findstr :3000`

### **Venv activation fails**
→ Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 💡 **Pro Tips**

1. **Use Wikipedia topics** - "photosynthesis", "blockchain", etc.
2. **Try all levels** - See how explanations adapt
3. **Check the backend docs** - http://localhost:8000/docs for API playground

---

## 📚 **Example Topics to Try**

- "Explain how blockchain technology works"
- "What is photosynthesis and why is it important?"
- "How do neural networks learn from data?"
- "Explain general relativity and spacetime curvature"

---

**Need help?** Check the main README.md for detailed documentation.
